
import * as React from "react"

const MOBILE_BREAKPOINT = 768 // Tablet and below

export function useIsMobile() {
  const [isMobile, setIsMobile] = React.useState<boolean | undefined>(undefined)

  React.useEffect(() => {
    // Function to handle resize and determine mobile state
    const handleResize = () => {
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT)
    }
    
    // Initial check
    handleResize()
    
    // Add event listener for window resize
    window.addEventListener("resize", handleResize)
    
    // Cleanup
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  return !!isMobile
}

// Additional hook for detecting touch devices
export function useIsTouchDevice() {
  const [isTouch, setIsTouch] = React.useState(false)
  
  React.useEffect(() => {
    const isTouchDevice = 'ontouchstart' in window || 
                          navigator.maxTouchPoints > 0 ||
                          (navigator as any).msMaxTouchPoints > 0
    
    setIsTouch(isTouchDevice)
  }, [])
  
  return isTouch
}

// Hook that combines touch and mobile detection
export function useDeviceType() {
  const isMobile = useIsMobile()
  const isTouch = useIsTouchDevice()
  
  return {
    isMobile,
    isTouch,
    isDesktop: !isMobile,
    isTouchEnabled: isTouch
  }
}
