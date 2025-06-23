// src/components/Layout.js
import HeadeComponents from './HeadeComponents';
import FooterComponent from './FooterComponent';

export default function Layout({ children }) {
  return (
    <>
      <HeadeComponents />
      {children}
      <FooterComponent />
    </>
  );
}
