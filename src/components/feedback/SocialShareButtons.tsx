
import { Share2, Twitter, Facebook, Linkedin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useIsMobile } from "@/hooks/use-mobile";
import { useTheme } from "@/context/ThemeContext";

type SocialShareButtonsProps = {
  feedbackItem?: {
    id: string;
    name: string;
    comments: string;
    ratings: Record<string, number>;
  };
  compact?: boolean;
};

const SocialShareButtons = ({ feedbackItem, compact = false }: SocialShareButtonsProps) => {
  const { toast } = useToast();
  const isMobile = useIsMobile();
  const { theme } = useTheme();
  
  const getAverageRating = () => {
    if (!feedbackItem?.ratings) return 0;
    const ratings = Object.values(feedbackItem.ratings);
    return ratings.length > 0 
      ? (ratings.reduce((a, b) => a + b, 0) / ratings.length).toFixed(1)
      : 0;
  };
  
  const getShareMessage = () => {
    if (!feedbackItem) return "Check out this great feedback on HotelEase!";
    
    const truncatedComment = feedbackItem.comments.length > 100
      ? `${feedbackItem.comments.substring(0, 100)}...`
      : feedbackItem.comments;
      
    return `"${truncatedComment}" - ${feedbackItem.name} (${getAverageRating()}/5 ⭐) via HotelEase`;
  };

  // Moved the declaration up before it's used
  const currentUrl = typeof window !== 'undefined' 
    ? window.location.href 
    : 'https://hotelease.app';

  const handleShare = async (platform: string) => {
    const message = getShareMessage();
    
    try {
      // Use Web Share API if available (mainly mobile)
      if (navigator.share && (platform === 'native' || isMobile)) {
        await navigator.share({
          title: 'Share Guest Feedback',
          text: message,
          url: currentUrl,
        });
        toast({
          title: "Shared successfully",
          description: "The feedback was shared successfully.",
        });
        return;
      }
      
      // Platform-specific sharing
      let shareUrl = '';
      
      switch (platform) {
        case 'twitter':
          shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(message)}&url=${encodeURIComponent(currentUrl)}`;
          break;
        case 'facebook':
          shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(currentUrl)}&quote=${encodeURIComponent(message)}`;
          break;
        case 'linkedin':
          shareUrl = `https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(currentUrl)}&title=Guest%20Feedback&summary=${encodeURIComponent(message)}`;
          break;
        default:
          // Copy to clipboard fallback
          await navigator.clipboard.writeText(`${message}\n${currentUrl}`);
          toast({
            title: "Copied to clipboard",
            description: "Share message copied to clipboard.",
          });
          return;
      }
      
      // Open share URL in a new window
      window.open(shareUrl, '_blank', 'noopener,noreferrer');
    } catch (error) {
      console.error('Error sharing:', error);
      toast({
        variant: "destructive",
        title: "Share failed",
        description: "Could not share the feedback. Please try again.",
      });
    }
  };
  
  // Compact mode (for list items or cards)
  if (compact) {
    return (
      <Button 
        variant="ghost" 
        size="sm"
        className="px-2"
        onClick={() => handleShare('native')}
        aria-label="Share feedback"
        title="Share feedback"
      >
        <Share2 className="h-4 w-4" />
      </Button>
    );
  }
  
  // Full mode (for detail views)
  return (
    <div className="flex flex-row gap-2 items-center">
      <span className="text-sm text-muted-foreground mr-1">Share:</span>
      <Button 
        variant="outline" 
        size="sm"
        onClick={() => handleShare('twitter')}
        className="rounded-full w-8 h-8 p-0"
        aria-label="Share on Twitter"
      >
        <Twitter className="h-3.5 w-3.5" />
      </Button>
      <Button 
        variant="outline" 
        size="sm"
        onClick={() => handleShare('facebook')}
        className="rounded-full w-8 h-8 p-0"
        aria-label="Share on Facebook"
      >
        <Facebook className="h-3.5 w-3.5" />
      </Button>
      <Button 
        variant="outline" 
        size="sm"
        onClick={() => handleShare('linkedin')}
        className="rounded-full w-8 h-8 p-0"
        aria-label="Share on LinkedIn"
      >
        <Linkedin className="h-3.5 w-3.5" />
      </Button>
    </div>
  );
};

export default SocialShareButtons;
