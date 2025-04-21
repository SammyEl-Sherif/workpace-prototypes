import { useEffect, useState } from 'react'

import styles from './StripeCheckout.module.scss'
import { SectionContainer } from '@/components'

export default function StripeCheckout() {
  const [orderPlaced, setOrderPlaced] = useState(false)
  const [orderCanceled, setOrderCanceled] = useState(false)

  useEffect(() => {
    // Check to see if this is a redirect back from Checkout
    const query = new URLSearchParams(window.location.search)
    if (query.get('success')) {
      setOrderPlaced(true)
    }

    if (query.get('canceled')) {
      setOrderCanceled(true)
    }
  }, [])

  return (
    <form action="/api/checkout" method="POST">
      <SectionContainer>
        <h1>Product Name</h1>
        {orderPlaced && <p>Order placed! You will receive an email confirmation.</p>}
        {orderCanceled && (
          <p>Order canceled -- continue to shop around and checkout when you’re ready.</p>
        )}
        <button type="submit" role="link" className={styles.button}>
          Checkout
        </button>
      </SectionContainer>
    </form>
  )
}
