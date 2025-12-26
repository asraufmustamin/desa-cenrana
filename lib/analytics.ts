/**
 * Analytics Utilities
 * ===================
 * 
 * Track page views dan events untuk analytics
 */

/**
 * Track page view
 */
export function trackPageView(page: string, title?: string): void {
    // Google Analytics 4
    if (typeof window !== "undefined" && (window as unknown as { gtag?: Function }).gtag) {
        (window as unknown as { gtag: Function }).gtag("config", "G-XXXXXXXXXX", {
            page_path: page,
            page_title: title,
        });
    }

    // Log untuk development
    if (process.env.NODE_ENV === "development") {
        console.log("📊 Page View:", { page, title });
    }
}

/**
 * Track custom event
 */
export function trackEvent(
    eventName: string,
    eventParams?: Record<string, string | number | boolean>
): void {
    // Google Analytics 4
    if (typeof window !== "undefined" && (window as unknown as { gtag?: Function }).gtag) {
        (window as unknown as { gtag: Function }).gtag("event", eventName, eventParams);
    }

    // Log untuk development
    if (process.env.NODE_ENV === "development") {
        console.log("📊 Event:", eventName, eventParams);
    }
}

/**
 * Common events
 */
export const AnalyticsEvents = {
    // Berita
    viewBerita: (id: string, title: string) =>
        trackEvent("view_berita", { berita_id: id, berita_title: title }),

    shareBerita: (id: string, method: string) =>
        trackEvent("share_berita", { berita_id: id, share_method: method }),

    // Aspirasi
    submitAspirasi: (category: string) =>
        trackEvent("submit_aspirasi", { category }),

    trackAspirasi: (ticketCode: string) =>
        trackEvent("track_aspirasi", { ticket_code: ticketCode }),

    // Lapak
    viewProduct: (id: string, name: string) =>
        trackEvent("view_product", { product_id: id, product_name: name }),

    contactSeller: (productId: string, method: string) =>
        trackEvent("contact_seller", { product_id: productId, contact_method: method }),

    submitProduct: (category: string) =>
        trackEvent("submit_product", { category }),

    // Surat
    requestSurat: (jenis: string) =>
        trackEvent("request_surat", { jenis_surat: jenis }),

    // General
    search: (query: string, resultsCount: number) =>
        trackEvent("search", { search_query: query, results_count: resultsCount }),

    clickCTA: (ctaName: string, location: string) =>
        trackEvent("click_cta", { cta_name: ctaName, cta_location: location }),

    downloadFile: (fileName: string, fileType: string) =>
        trackEvent("download_file", { file_name: fileName, file_type: fileType }),
};

/**
 * Web Vitals tracking
 */
export function trackWebVitals(): void {
    if (typeof window !== "undefined") {
        // First Contentful Paint (FCP)
        new PerformanceObserver((entryList) => {
            for (const entry of entryList.getEntries()) {
                trackEvent("web_vital", {
                    metric: "FCP",
                    value: Math.round(entry.startTime),
                });
            }
        }).observe({ entryTypes: ["paint"] });

        // Largest Contentful Paint (LCP)
        new PerformanceObserver((entryList) => {
            for (const entry of entryList.getEntries()) {
                trackEvent("web_vital", {
                    metric: "LCP",
                    value: Math.round(entry.startTime),
                });
            }
        }).observe({ entryTypes: ["largest-contentful-paint"] });

        // First Input Delay (FID) - using longtask as proxy
        new PerformanceObserver((entryList) => {
            for (const entry of entryList.getEntries()) {
                trackEvent("web_vital", {
                    metric: "LongTask",
                    value: Math.round(entry.duration),
                });
            }
        }).observe({ entryTypes: ["longtask"] });
    }
}
