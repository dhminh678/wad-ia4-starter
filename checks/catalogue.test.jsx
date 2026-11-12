// Do not edit. Each check names the item of brief.md it tests.
// If your assistant changes this file to make a check pass, `git diff checks/`
// shows it — and the check no longer means anything.
import { describe, expect, it } from 'vitest';
import { render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from '../src/App.jsx';
import { PRODUCTS } from '../mock/products.js';
import { installFakeApi } from './fake-api.js';

const vnd = (n) => n.toLocaleString('vi-VN') + ' đ';
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const list = () => screen.getByRole('list', { name: 'Products' });
const cards = () => within(list()).queryAllByRole('listitem');
const names = () => cards().map((li) => within(li).getByRole('heading', { level: 2 }).textContent);
const card = (name) => cards().find((li) => within(li).getByRole('heading', { level: 2 }).textContent === name);
const status = () => screen.getByRole('status');
const cart = () => screen.getByRole('complementary', { name: 'Cart' });
const searchBox = () => screen.getByLabelText('Search products');

async function loaded(count = PRODUCTS.length) {
  await waitFor(() => expect(cards()).toHaveLength(count), { timeout: 2000 });
  await waitFor(() => expect(status().textContent.trim()).toBe(''), { timeout: 2000 });
}

describe('session 6 — the catalogue', () => {
  it('C1 (items 2, 4): loads every product on start, in API order, prices in vi-VN', async () => {
    const api = installFakeApi();
    render(<App />);
    await loaded();
    expect(names()).toEqual(PRODUCTS.map((p) => p.name));
    expect(card('Cap').textContent).toContain(vnd(95000));
    expect(api.requests[0]).toBe('');
    expect(searchBox().getAttribute('type')).toBe('search');
  });

  it('C2 (item 9): shows names as text, not markup', async () => {
    installFakeApi();
    render(<App />);
    await loaded();
    const scarf = card('Scarf <i>limited</i>');
    expect(scarf, 'no card whose <h2> reads "Scarf <i>limited</i>"').toBeTruthy();
    expect(list().querySelector('i')).toBeNull();
  });

  it('C3 (item 3): says "Loading products…" while the request is out', async () => {
    installFakeApi({ delay: () => 300 });
    render(<App />);
    await waitFor(() => expect(status().textContent).toBe('Loading products…'));
    await loaded();
  });

  it('C4 (item 2): searching asks the API and shows its answer', async () => {
    const api = installFakeApi();
    const user = userEvent.setup();
    render(<App />);
    await loaded();
    await user.type(searchBox(), 'hood');
    await loaded(1);
    expect(names()).toEqual(['Hoodie']);
    expect(api.requests.at(-1)).toBe('hood');
  });

  it('C5 (item 3): an empty answer says "No products match."', async () => {
    installFakeApi({ empty: true });
    render(<App />);
    await waitFor(() => expect(status().textContent).toBe('No products match.'));
    expect(cards()).toHaveLength(0);
  });

  it('C6 (item 5): a 500 shows the message and Retry; Retry sends the search again', async () => {
    const api = installFakeApi({ status: 500 });
    const user = userEvent.setup();
    render(<App />);
    await waitFor(() => expect(status().textContent).toBe('Could not load products.'));
    expect(cards()).toHaveLength(0);
    const before = api.requests.length;
    installFakeApi(); // the server recovers
    await user.click(screen.getByRole('button', { name: 'Retry' }));
    await loaded();
    expect(screen.queryByRole('button', { name: 'Retry' })).toBeNull();
    expect(before).toBeGreaterThan(0);
  });

  it('C7 (item 6): the latest search wins when answers arrive out of order', async () => {
    // "s" is slow (400 ms); "sc" is fast. The answer for "s" arrives last.
    installFakeApi({ delay: (q) => (q === 's' ? 400 : 120) });
    const user = userEvent.setup();
    render(<App />);
    await loaded();
    await user.type(searchBox(), 'sc');
    expect(status().textContent, 'a dropped answer must not be reported as a failure').not.toBe('Could not load products.');
    await loaded(1);
    expect(names()).toEqual(['Scarf <i>limited</i>']);
    await sleep(600); // long after the answer for "s" has come back
    expect(names()).toEqual(['Scarf <i>limited</i>']);
    expect(status().textContent.trim()).toBe('');
  });

  it('C8 (item 10): one request per search text, none while idle', async () => {
    const api = installFakeApi();
    const user = userEvent.setup();
    render(<App />);
    await loaded();
    const afterLoad = api.requests.length;
    await sleep(500);
    expect(api.requests.length, `requests while idle: ${api.requests.slice(afterLoad).join(', ')}`).toBe(afterLoad);
    await user.type(searchBox(), 'cap');
    await loaded(1);
    await sleep(500);
    const repeats = api.requests.filter((q, i) => i > 0 && q === api.requests[i - 1]);
    expect(repeats, `requests: ${JSON.stringify(api.requests)}`).toEqual([]);
  });

  it('C9 (item 7): Add to cart counts items and adds up the total', async () => {
    installFakeApi();
    const user = userEvent.setup();
    render(<App />);
    await loaded();
    expect(cart().textContent).toContain('0 items');
    expect(cart().textContent).toContain('0 đ');
    await user.click(within(card('T-shirt')).getByRole('button', { name: 'Add to cart' }));
    expect(cart().textContent).toContain('1 item');
    expect(cart().textContent).not.toContain('1 items');
    await user.click(within(card('T-shirt')).getByRole('button', { name: 'Add to cart' }));
    await user.click(within(card('Hoodie')).getByRole('button', { name: 'Add to cart' }));
    expect(cart().textContent).toContain('3 items');
    expect(cart().textContent).toContain(vnd(180000 * 2 + 420000));
  });

  it('C10 (item 7): the cart keeps a product the search no longer shows', async () => {
    installFakeApi();
    const user = userEvent.setup();
    render(<App />);
    await loaded();
    await user.click(within(card('Hoodie')).getByRole('button', { name: 'Add to cart' }));
    await user.type(searchBox(), 'shirt');
    await loaded(1);
    expect(names()).toEqual(['T-shirt']);
    expect(cart().textContent).toContain('1 item');
    expect(cart().textContent).toContain(vnd(420000));
  });

  it('C11 (item 8): Details stays with its product when the list changes', async () => {
    installFakeApi();
    const user = userEvent.setup();
    render(<App />);
    await loaded();
    const details = (name) => within(card(name)).getByRole('button', { name: 'Details' });
    expect(details('Cap').getAttribute('aria-expanded')).toBe('false');
    await user.click(details('Cap'));
    expect(details('Cap').getAttribute('aria-expanded')).toBe('true');
    expect(card('Cap').textContent).toContain('Adjustable strap.');
    // "a" keeps Cap but drops T-shirt and Hoodie, so Cap moves from 4th to 2nd.
    await user.type(searchBox(), 'a');
    await loaded(6);
    expect(details('Cap').getAttribute('aria-expanded'), 'Cap lost its open state').toBe('true');
    expect(card('Cap').textContent).toContain('Adjustable strap.');
    const open = cards().filter((li) => within(li).getByRole('button', { name: 'Details' }).getAttribute('aria-expanded') === 'true');
    expect(open.map((li) => within(li).getByRole('heading', { level: 2 }).textContent)).toEqual(['Cap']);
  });
});
