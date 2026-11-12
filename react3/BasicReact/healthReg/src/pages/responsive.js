const responsive = `
  * { box-sizing: border-box; }
  @media (max-width: 768px) {
    .reg-card { width: 90% !important; padding: 22px 20px !important; }
  }
  @media (max-width: 480px) {
    .reg-card { width: 95% !important; padding: 18px 14px !important; border-radius: 10px !important; }
    .reg-card input, .reg-card select, .reg-card textarea { font-size: 13px !important; padding: 9px 10px !important; }
    .reg-card button[type="submit"] { font-size: 14px !important; padding: 11px !important; }
    .reg-card h2 { font-size: 17px !important; }
  }
  @media (max-width: 360px) {
    .reg-card { width: 100% !important; border-radius: 0 !important; box-shadow: none !important; padding: 16px 12px !important; }
  }
`;

export default responsive;