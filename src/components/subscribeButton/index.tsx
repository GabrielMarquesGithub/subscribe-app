import { useSession, signIn } from "next-auth/react";
import { api } from "../../services/api";
import { stripe } from "../../services/stripe";
import { getStripeJs } from "../../services/stripe-js";

import styles from "./style.module.scss";

interface ISubscribeButtonProps {
  priceId: string;
}

export function SubscribeButton({ priceId }: ISubscribeButtonProps) {
  const { data: session } = useSession();

  const handleSubscribe = async () => {
    if (!session) return signIn();

    try {
      const response = await api.post("/subscribe");

      const { sessionId } = response.data;

      const stripe = await getStripeJs();

      stripe.redirectToCheckout({ sessionId });
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <button
      className={styles.subscribeButton}
      type="button"
      onClick={handleSubscribe}
    >
      Subscribe now
    </button>
  );
}
