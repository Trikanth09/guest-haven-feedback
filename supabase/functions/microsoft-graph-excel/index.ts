
// Follow this setup guide to integrate the Deno runtime into your Supabase project:
// https://docs.supabase.com/docs/guides/functions/deno-runtime

import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { corsHeaders } from "../_shared/cors.ts";

// MSAL (Microsoft Authentication Library) dependencies would be needed in a production environment
// For this demo, we'll use a simpler approach with an access token

const GRAPH_API_ENDPOINT = "https://graph.microsoft.com/v1.0";

serve(async (req) => {
  // Handle CORS
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }
  
  try {
    const { action, fileUrl, worksheetName, values } = await req.json();
    
    // Only implement appendRow action for now
    if (action !== "appendRow") {
      throw new Error("Invalid action specified");
    }
    
    // Get Microsoft Graph API access token from environment variable
    // In production, use proper token acquisition with refresh capabilities
    const accessToken = Deno.env.get("MICROSOFT_GRAPH_TOKEN");
    
    if (!accessToken) {
      throw new Error("Microsoft Graph access token not configured");
    }

    // Extract file ID from OneDrive URL
    // This is a simplified approach - production code should use proper URL parsing
    const fileIdMatch = fileUrl.match(/([a-zA-Z0-9]{16})/);
    const fileId = fileIdMatch ? fileIdMatch[0] : null;
    
    if (!fileId) {
      throw new Error("Could not extract file ID from OneDrive URL");
    }
    
    // First, get worksheet ID by name
    const workbookResponse = await fetch(
      `${GRAPH_API_ENDPOINT}/me/drive/items/${fileId}/workbook/worksheets`,
      {
        headers: {
          "Authorization": `Bearer ${accessToken}`,
          "Content-Type": "application/json"
        }
      }
    );
    
    if (!workbookResponse.ok) {
      const errorData = await workbookResponse.json();
      throw new Error(`Microsoft Graph API error: ${JSON.stringify(errorData)}`);
    }
    
    const worksheets = await workbookResponse.json();
    const worksheet = worksheets.value.find((sheet: any) => sheet.name === worksheetName);
    
    if (!worksheet) {
      throw new Error(`Worksheet '${worksheetName}' not found`);
    }
    
    // Get the last row to know where to append
    const usedRangeResponse = await fetch(
      `${GRAPH_API_ENDPOINT}/me/drive/items/${fileId}/workbook/worksheets/${worksheet.id}/usedRange`,
      {
        headers: {
          "Authorization": `Bearer ${accessToken}`,
          "Content-Type": "application/json"
        }
      }
    );
    
    if (!usedRangeResponse.ok) {
      const errorData = await usedRangeResponse.json();
      throw new Error(`Microsoft Graph API error: ${JSON.stringify(errorData)}`);
    }
    
    const usedRange = await usedRangeResponse.json();
    const lastRow = usedRange.rowCount;
    
    // Append row at the next available row
    const appendResponse = await fetch(
      `${GRAPH_API_ENDPOINT}/me/drive/items/${fileId}/workbook/worksheets/${worksheet.id}/range(address='A${lastRow + 1}')`,
      {
        method: "PATCH",
        headers: {
          "Authorization": `Bearer ${accessToken}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          values: [values]
        })
      }
    );
    
    if (!appendResponse.ok) {
      const errorData = await appendResponse.json();
      throw new Error(`Microsoft Graph API error: ${JSON.stringify(errorData)}`);
    }
    
    // Return success response
    return new Response(
      JSON.stringify({ success: true, message: "Row appended successfully" }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200
      }
    );

  } catch (error) {
    // Return error response
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 400
      }
    );
  }
});
