// TODO: Replace contents with AllayPay Authorize.net Accept.js hosted payment form
// when AllayPay credentials are received. Drop in replacement — no other files need changing.
// AllayPay integration guide: https://developer.authorize.net/api/reference/features/acceptjs.html

export default function PaymentCardForm() {
  return (
    <div className="bg-blue-50 border border-blue-200 rounded-xl p-5 text-center space-y-2">
      <p className="font-semibold text-[#0D1F35] text-sm">Card payments are coming soon</p>
      <p className="text-gray-500 text-sm">We are currently finalizing our secure card processing integration.</p>
      <p className="text-gray-500 text-sm">In the meantime please use cryptocurrency.</p>
      <p className="text-sm text-gray-500">
        For immediate assistance email{' '}
        <a href="mailto:support@noctapeptides.com" className="text-[#0D1F35] underline font-medium">
          support@noctapeptides.com
        </a>
      </p>
    </div>
  );
}
