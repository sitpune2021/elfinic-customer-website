// ProductCard.jsx — Myntra-style compact card
import React from "react";
import styles from "./ProductCard.module.css";

function ProductCard({
  name = "Product",
  discount = "50% Off",
  src,
}) {
  return (
    <div className={styles.myntraCard}>
      <div className={styles.myntraCardImageWrap}>
        <img
          src={src}
          alt={name}
          className={styles.myntraCardImage}
          loading="lazy"
          draggable={false}
        />
      </div>
      <div className={styles.myntraCardInfo}>
        <p className={styles.myntraCardName}>{name}</p>
        <p className={styles.myntraCardDiscount}>{discount}</p>
      </div>
    </div>
  );
}

export default ProductCard;
