export default function ContactUs() {
  return (
    <section className="px-4 md:px-10 py-16 max-w-[700px] mx-auto">
      <h1 className="text-3xl font-bold text-gray-900 mb-2">Contact Us</h1>
      <p className="text-gray-500 text-sm mb-10">
        Questions about an order or a product? Reach us through any of the channels below.
      </p>

      <div className="flex flex-col gap-6">
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 rounded-full bg-red-50 text-red-600 flex items-center justify-center flex-shrink-0">
            <i className="fas fa-map-marker-alt"></i>
          </div>
          <div>
            <div className="font-bold text-gray-900 text-sm">Address</div>
            <p className="text-gray-500 text-sm mt-1">123 Main Street, Phnom Penh, Cambodia</p>
          </div>
        </div>

        <div className="flex items-start gap-4">
          <div className="w-10 h-10 rounded-full bg-red-50 text-red-600 flex items-center justify-center flex-shrink-0">
            <i className="fas fa-phone-alt"></i>
          </div>
          <div>
            <div className="font-bold text-gray-900 text-sm">Phone</div>
            <p className="text-gray-500 text-sm mt-1">+855 12 345 678</p>
          </div>
        </div>

        <div className="flex items-start gap-4">
          <div className="w-10 h-10 rounded-full bg-red-50 text-red-600 flex items-center justify-center flex-shrink-0">
            <i className="fas fa-envelope"></i>
          </div>
          <div>
            <div className="font-bold text-gray-900 text-sm">Email</div>
            <p className="text-gray-500 text-sm mt-1">support@yourstore.com</p>
          </div>
        </div>

        <div className="flex items-start gap-4">
          <div className="w-10 h-10 rounded-full bg-red-50 text-red-600 flex items-center justify-center flex-shrink-0">
            <i className="fas fa-clock"></i>
          </div>
          <div>
            <div className="font-bold text-gray-900 text-sm">Store Hours</div>
            <p className="text-gray-500 text-sm mt-1">Mon–Sat, 9:00 AM – 6:00 PM</p>
          </div>
        </div>
      </div>
    </section>
  )
}