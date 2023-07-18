const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const storeItems = new Map([
  [1, { priceInCents: 10000, name: "3 Month subscription " }],
  [2, { priceInCents: 20000, name: "1 Year subscription" }],
])

export default async function handler(req, res) {
  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      line_items: req.body.items.map(item => {
        const storeItem = storeItems.get(item.id)
        return {
          price_data: {
            currency: "usd",
            product_data: {
              name: storeItem.name,
            },
            unit_amount: storeItem.priceInCents,
          },
          quantity: item.quantity,
        }
      }),
      success_url: `${process.env.URL}/Success`,
      cancel_url: `${process.env.URL}/Cancel`,
    })
    res.json({ url: session.url })
  } catch (e) {
    res.status(500).json({ error: e.message })
  }
}
