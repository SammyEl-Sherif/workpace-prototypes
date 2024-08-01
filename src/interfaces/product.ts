export type StripeProduct = {
  id: string
  object: string
  active: boolean
  attributes: string[]
  created: number
  default_price: string
  description?: string | null
  images: string[] // Replace any[] with string[]
  livemode: boolean
  marketing_features: string[]
  metadata: object
  name: string
  package_dimensions?: string | null
  shippable?: boolean | null
  statement_descriptor?: string | null
  tax_code?: string | null
  type: string
  unit_label?: string | null
  updated: number
  url?: string | null
}

export type StripeAllProductsDTO = {
  object?: string
  data?: Product[]
  has_more?: boolean
  url?: string
}

interface Product {
  /**
   * Unique identifier for the object.
   */
  id: string

  /**
   * String representing the object's type. Objects of the same type share the same value.
   */
  object: 'product'

  /**
   * Whether the product is currently available for purchase.
   */
  active: boolean

  /**
   * Time at which the object was created. Measured in seconds since the Unix epoch.
   */
  created: number

  /**
   * The ID of the [Price](https://stripe.com/docs/api/prices) object that is the default price for this product.
   */
  default_price?: string | null | any

  /**
   * Always true for a deleted object
   */
  deleted?: void

  /**
   * The product's description, meant to be displayable to the customer. Use this field to optionally store a long form explanation of the product being sold for your own rendering purposes.
   */
  description: string | null

  /**
   * A list of up to 8 URLs of images for this product, meant to be displayable to the customer.
   */
  images: Array<string>

  /**
   * Has the value `true` if the object exists in live mode or the value `false` if the object exists in test mode.
   */
  livemode: boolean

  /**
   * A list of up to 15 marketing features for this product. These are displayed in [pricing tables](https://stripe.com/docs/payments/checkout/pricing-table).
   */
  marketing_features: Array<any>

  /**
   * Set of [key-value pairs](https://stripe.com/docs/api/metadata) that you can attach to an object. This can be useful for storing additional information about the object in a structured format.
   */
  metadata: any

  /**
   * The product's name, meant to be displayable to the customer.
   */
  name: string

  /**
   * The dimensions of this product for shipping purposes.
   */
  package_dimensions: any | null

  /**
   * Whether this product is shipped (i.e., physical goods).
   */
  shippable: boolean | null

  /**
   * Extra information about a product which will appear on your customer's credit card statement. In the case that multiple products are billed at once, the first statement descriptor will be used. Only used for subscription payments.
   */
  statement_descriptor?: string | null

  /**
   * A [tax code](https://stripe.com/docs/tax/tax-categories) ID.
   */
  tax_code: string | any | null

  /**
   * The type of the product. The product is either of type `good`, which is eligible for use with Orders and SKUs, or `service`, which is eligible for use with Subscriptions and Plans.
   */
  type: any

  /**
   * A label that represents units of this product. When set, this will be included in customers' receipts, invoices, Checkout, and the customer portal.
   */
  unit_label?: string | null

  /**
   * Time at which the object was last updated. Measured in seconds since the Unix epoch.
   */
  updated: number

  /**
   * A URL of a publicly-accessible webpage for this product.
   */
  url: string | null
}
