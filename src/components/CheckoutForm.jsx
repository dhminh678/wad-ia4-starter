import { useState } from 'react';
import { formatVnd } from '../format.js';

const NAME_MSG = 'Enter your name.';
const PHONE_MSG = 'Enter a 10-digit phone number starting with 0.';
const CART_MSG = 'Add something to the cart first.';
const NOTE_MAX = 200;

export default function CheckoutForm({ count, total, onOrder }) {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [note, setNote] = useState('');
  const [tried, setTried] = useState(false); // has Place order been pressed yet?
  const [confirmation, setConfirmation] = useState('');

  // Errors are worked out from the fields on every render — never stored.
  const nameInvalid = name.trim() === '';
  const phoneInvalid = !/^0\d{9}$/.test(phone);
  const cartEmpty = count === 0;
  const showName = tried && nameInvalid;
  const showPhone = tried && phoneInvalid;
  const showCart = tried && cartEmpty;

  const handleSubmit = (e) => {
    e.preventDefault();
    setConfirmation('');
    setTried(true);
    if (nameInvalid || phoneInvalid || cartEmpty) return;
    setConfirmation(
      `Order placed for ${name.trim()}: ${count} ${count === 1 ? 'item' : 'items'}, ${formatVnd(total)}.`,
    );
    onOrder();
    setName('');
    setPhone('');
    setNote('');
    setTried(false);
  };

  return (
    <form aria-label="Checkout" onSubmit={handleSubmit} noValidate className="checkout">
      <div className="field">
        <label htmlFor="co-name">Name</label>
        <input
          id="co-name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          aria-invalid={showName ? 'true' : undefined}
          aria-describedby={showName ? 'co-name-error' : undefined}
        />
        {showName && <p id="co-name-error" className="error">{NAME_MSG}</p>}
      </div>
      <div className="field">
        <label htmlFor="co-phone">Phone</label>
        <input
          id="co-phone"
          type="tel"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          aria-invalid={showPhone ? 'true' : undefined}
          aria-describedby={showPhone ? 'co-phone-error' : undefined}
        />
        {showPhone && <p id="co-phone-error" className="error">{PHONE_MSG}</p>}
      </div>
      <div className="field">
        <label htmlFor="co-note">Note (optional)</label>
        <textarea
          id="co-note"
          rows={3}
          maxLength={NOTE_MAX}
          value={note}
          onChange={(e) => setNote(e.target.value)}
          aria-describedby="co-note-count"
        />
        <p id="co-note-count" className="counter">{note.length}/{NOTE_MAX}</p>
      </div>
      {showCart && <p className="error" role="alert">{CART_MSG}</p>}
      <button type="submit">Place order</button>
      <div aria-live="polite" className="confirmation">{confirmation}</div>
    </form>
  );
}
