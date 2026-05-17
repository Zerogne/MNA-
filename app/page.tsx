import Navbar from "@/components/navbar"
import HeroSection from "@/components/hero-section"
import SearchBar from "@/components/search-bar"
import FeaturedStock from "@/components/featured-stock"
import ShippingInfo from "@/components/shipping-info"
import ContactForm from "@/components/contact-form"
import Footer from "@/components/footer"

export default function HomePage() {
  return (
    <>
      {/* Full-width sticky header — outside the constrained wrapper */}
      
      <Navbar />

      {/* Full-width content to match the reference layout */}
      <div className="w-full bg-white">
        <main>
          <HeroSection />
          <SearchBar />
          <FeaturedStock />
          <ShippingInfo />
          <ContactForm />
          <Footer />
        </main>
      </div>
    </>
  )
}
