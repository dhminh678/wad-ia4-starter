// Do not edit. Each check names the item of brief-ia4.md it tests.
// If your assistant changes this file to make a check pass, `git diff checks/`
// shows it — and the check no longer means anything.
import { describe, expect, it } from 'vitest';
import { fireEvent, render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from '../src/App.jsx';
import { PRODUCTS } from '../mock/products.js';
import { installFakeApi } from './fake-api.js';

const vnd = (n) => n.toLocaleString('vi-VN') + ' đ';

const list = () => screen.getByRole('list', { name: 'Products' });
const cards = () => within(list()).queryAllByRole('listitem');
const card = (name) => cards().find((li) => within(li).getByRole('heading', { level: 2 }).textContent === name);
const status = () => screen.getByRole('status');
const cart = () => screen.getByRole('complementary', { name: 'Cart' });
const searchBox = () => screen.getByLabelText('Search products');
const header = () => screen.getByRole('banner');
const savedPanel = () => screen.getByRole('region', { name: 'Saved' });
const savedNames = () => within(savedPanel()).queryAllByRole('listitem').map((li) => li.textContent.trim());
const save = (name) => within(card(name)).getByRole('button', { name: 'Save' });
const add = (name) => within(card(name)).getByRole('button', { name: 'Add to cart' });
const form = () => screen.getByRole('form', { name: 'Checkout' });
const field = (label) => within(form()).getByLabelText(label);
const placeOrder = () => within(form()).getByRole('button', { name: 'Place order' });
const NAME_MSG = 'Enter your name.';
const PHONE_MSG = 'Enter a 10-digit phone number starting with 0.';
const CART_MSG = 'Add something to the cart first.';

async function loaded(count = PRODUCTS.length) {
  await waitFor(() => expect(cards()).toHaveLength(count), { timeout: 2000 });
  await waitFor(() => expect(status().textContent.trim()).toBe(''), { timeout: 2000 });
}

// The message an input points to with aria-describedby (W3C: ids separated by spaces).
function describedText(input) {
  const ids = (input.getAttribute('aria-describedby') || '').split(/\s+/).filter(Boolean);
  return ids.map((id) => document.getElementById(id)?.textContent ?? '').join(' ').trim();
}

describe('IA#4 — wishlist through a context', () => {
  it('I1 (W1, W2): Save toggles aria-pressed, and the header counts saved products', async () => {
    installFakeApi();
    const user = userEvent.setup();
    render(<App />);
    await loaded();
    expect(within(header()).getByRole('heading', { level: 1 }).textContent).toBe('Shop');
    expect(header().textContent).toContain('Saved: 0');
    expect(save('Cap').getAttribute('aria-pressed')).toBe('false');
    await user.click(save('Cap'));
    await user.click(save('Jacket'));
    expect(save('Cap').getAttribute('aria-pressed')).toBe('true');
    expect(header().textContent).toContain('Saved: 2');
    await user.click(save('Cap'));
    expect(save('Cap').getAttribute('aria-pressed')).toBe('false');
    expect(header().textContent).toContain('Saved: 1');
  });

  it('I2 (W3): the Saved panel lists names in the order saved, or says nothing is saved', async () => {
    installFakeApi();
    const user = userEvent.setup();
    render(<App />);
    await loaded();
    expect(savedPanel().textContent).toContain('Nothing saved yet.');
    expect(savedNames()).toEqual([]);
    await user.click(save('Jacket'));
    await user.click(save('Scarf <i>limited</i>'));
    await user.click(save('Cap'));
    expect(savedNames()).toEqual(['Jacket', 'Scarf <i>limited</i>', 'Cap']);
    expect(savedPanel().querySelector('i')).toBeNull();
    expect(savedPanel().textContent).not.toContain('Nothing saved yet.');
  });

  it('I3 (W4): saved products stay saved when the search hides them', async () => {
    installFakeApi();
    const user = userEvent.setup();
    render(<App />);
    await loaded();
    await user.click(save('Cap'));
    await user.type(searchBox(), 'hood');
    await loaded(1);
    expect(header().textContent).toContain('Saved: 1');
    expect(savedNames()).toEqual(['Cap']);
    await user.clear(searchBox());
    await loaded();
    expect(save('Cap').getAttribute('aria-pressed')).toBe('true');
    expect(save('Hoodie').getAttribute('aria-pressed')).toBe('false');
  });
});

describe('IA#4 — the checkout form', () => {
  it('I4 (F1): submitting never lets the browser leave the page', async () => {
    installFakeApi();
    render(<App />);
    await loaded();
    // fireEvent returns false when the handler called preventDefault().
    expect(fireEvent.submit(form()), 'the submit was not prevented: the page would reload').toBe(false);
  });

  it('I5 (F2, F3): no messages before the first try; then one per field, linked with aria-describedby', async () => {
    installFakeApi();
    const user = userEvent.setup();
    render(<App />);
    await loaded();
    expect(form().textContent).not.toContain(NAME_MSG);
    expect(form().textContent).not.toContain(PHONE_MSG);
    await user.click(placeOrder());
    expect(describedText(field('Name'))).toContain(NAME_MSG);
    expect(describedText(field('Phone'))).toContain(PHONE_MSG);
    expect(form().textContent).toContain(CART_MSG);
    expect(field('Name').getAttribute('aria-invalid')).toBe('true');
  });

  it('I6 (F2): the phone must be 10 digits starting with 0', async () => {
    installFakeApi();
    const user = userEvent.setup();
    render(<App />);
    await loaded();
    await user.click(add('Cap'));
    await user.type(field('Name'), 'An');
    for (const bad of ['', '090123456', '9012345678', '09012345678', '09o1234567']) {
      await user.clear(field('Phone'));
      if (bad) await user.type(field('Phone'), bad);
      await user.click(placeOrder());
      expect(describedText(field('Phone')), `phone "${bad}" was accepted`).toContain(PHONE_MSG);
      expect(form().textContent).not.toContain('Order placed');
    }
    expect(describedText(field('Name'))).not.toContain(NAME_MSG);
  });

  it('I7 (F4): a valid order is confirmed, empties the cart and the fields, and keeps the wishlist', async () => {
    installFakeApi();
    const user = userEvent.setup();
    render(<App />);
    await loaded();
    await user.click(save('Jacket'));
    await user.click(add('Cap'));
    await user.click(add('Hoodie'));
    await user.type(field('Name'), 'An');
    await user.type(field('Phone'), '0901234567');
    await user.click(placeOrder());
    expect(form().textContent).toContain(`Order placed for An: 2 items, ${vnd(95000 + 420000)}.`);
    expect(cart().textContent).toContain('0 items');
    expect(field('Name').value).toBe('');
    expect(field('Phone').value).toBe('');
    expect(header().textContent).toContain('Saved: 1');
    expect(form().textContent).not.toContain(NAME_MSG);
  });

  it('I8 (F5): the note counts its characters and stops at 200', async () => {
    installFakeApi();
    const user = userEvent.setup();
    render(<App />);
    await loaded();
    const note = field('Note (optional)');
    expect(note.tagName).toBe('TEXTAREA');
    expect(form().textContent).toContain('0/200');
    await user.type(note, 'hello');
    expect(form().textContent).toContain('5/200');
    expect(note.getAttribute('maxlength')).toBe('200');
  });
});
