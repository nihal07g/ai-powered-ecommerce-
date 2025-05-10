"use client"

export function trackProductView(productId: string) {
  if (typeof window === "undefined") return

  // Get existing view history
  const history = JSON.parse(localStorage.getItem("viewHistory") || "[]")

  // Add the product ID to the history if it's not already there
  if (!history.includes(productId)) {
    // Add to the beginning of the array
    history.unshift(productId)

    // Keep only the last 10 viewed products
    const limitedHistory = history.slice(0, 10)

    // Save back to localStorage
    localStorage.setItem("viewHistory", JSON.stringify(limitedHistory))
  } else {
    // If the product is already in history, move it to the beginning
    const updatedHistory = [productId, ...history.filter((id: string) => id !== productId)]

    localStorage.setItem("viewHistory", JSON.stringify(updatedHistory))
  }
}
