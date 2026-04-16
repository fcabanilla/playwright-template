/**
 * Generate authenticated.preprod.es.json from manually extracted browser data.
 *
 * This is a ONE-TIME script for bootstrapping the state file.
 * For regular use, run: TEST_ENV=preprod npx playwright test --project=auth-login-setup
 *
 * Usage: node scripts/generate-auth-state-manual.cjs
 */
const fs = require('fs');
const path = require('path');

function toEpoch(isoDate) {
  return new Date(isoDate).getTime() / 1000;
}

// ── Cookies from DevTools (2026-04-15) ─────────────────────────
const cookies = [
  {
    name: '__cf_bm',
    value: '_SxDo6SQSTEDiTcRseuX.HhGa1FWpulWtC6ftqyjGwg-1776268966.3370125-1.0.1.1-rfkqseILswPGEyIbCabblWIGPPUUVu7hZw.mSDIi6C6ztzDu.E_qXOZ5Mbszw9PORaR4Lb7ugkt7fkPhtiJAtr.9I_WF.jvqQjs3LqZH_.PXYTIp96wLGBGwLqA6RrcW',
    domain: '.ocgtest.es',
    path: '/',
    expires: toEpoch('2026-04-15T16:32:45.580Z'),
    httpOnly: true,
    secure: true,
    sameSite: 'Lax',
  },
  {
    name: 'CF_AppSession',
    value: '3434f81455ac8504',
    domain: 'preprod-web.ocgtest.es',
    path: '/',
    expires: toEpoch('2026-04-16T16:00:20.738Z'),
    httpOnly: true,
    secure: true,
    sameSite: 'Lax',
  },
  {
    name: 'CF_Authorization',
    value: 'eyJhbGciOiJSUzI1NiIsImtpZCI6IjUzODY2ZjE4MmJkNTgwYWZjZDJlZDNkMjE3ZGEzMGVjZjkzYmI2ODJhNTQzYmQyN2Y1ZWYyNzU4YmYyMTQzOGIifQ.eyJhdWQiOlsiY2FmNzMyNWFkNzhlMzAxMGI5MjNiNjYzODhlYmUyYTU0NDY0MjI5OTFjNjlhOGM5NDBhY2E0YzQ4NjM3YjBkMCJdLCJlbWFpbCI6ImYuY2FiYW5pbGxhQG9kZW9uLmNvbSIsImV4cCI6MTc3NzQ3ODU2MSwiaWF0IjoxNzc2MjY4OTYxLCJuYmYiOjE3NzYyNjg5NjEsImlzcyI6Imh0dHBzOi8vY2luZXNhLmNsb3VkZmxhcmVhY2Nlc3MuY29tIiwidHlwZSI6ImFwcCIsImlkZW50aXR5X25vbmNlIjoidlNEMHRleDh0RW5QUHZNUCIsInN1YiI6ImQ4NDg5MWQxLTEwMTItNWEyYS04OWQ2LTM0NTBlNGUxY2ZkMyIsImNvdW50cnkiOiJHQiIsInBvbGljeV9pZCI6Ijc0ZTRkMGI1LTUyOWUtNDQ0Ni04MjBiLTkxMDIzMDc5ZDQ4NiJ9.YIx1iPTz_rjmFv7Kpg2ORLEoadKMZSPqvasA8TP-DVX7RbkQXT26uywW3ysI1ZVP_B6apWn3sEEvH5v5kvhyzMN02d9rjl7rINJyjpUvs0XBvMbeY0DMnH93BARhI8Mn1z0WGmoZ7l2NpXNMf8lEqPAedlLoq_goNFudt3gIBRPysAt6hdm5T2L84DLsI7MnUB7XNoTc1sQTspiXMToi6QXv8Jj94_g9fKb5RVg_PbRCuUlV9xXLoKPPOfpiIYJyZZhIhymnaLo_3g9OhOUyHg5Io3oO6WIU3g_d6BZjM7asLAlwgbIFJecmrCeFIPXXwpRsx29M0JY0YCXZ3a_6qA',
    domain: 'preprod-web.ocgtest.es',
    path: '/',
    expires: toEpoch('2026-04-29T16:02:40.571Z'),
    httpOnly: true,
    secure: true,
    sameSite: 'None',
  },
  {
    name: 'cf_clearance',
    value: 'n3yXBoCLygCzNmwQmKnTIgYgQJGQzYdTEuz4dy0yJvA-1776268966-1.2.1.1-kXvj0JqnQZ9W63mF3bBnTefzdHa7wRi2T_M_5hCF.HILLtKkC4zp7AAz6G.NR6x13sJEU59QDCh0isGuM1NbsrLHLkxA.xKDRRYjk3W3Rq2CJ2zfqSJ7VmpdJoymmDdSUpqmCo2OuaoFR.A_UGI_nm_C1HnuoxF9yDEzuq6kW7ssJXpp83QLlnUJk4fd8XCCqvHP37gLoINYxJnYdLCJ7cWFJMT_Hjx4rCltG1R7lqfQrzUcSy9LgvuVWOIRk9WPrum.KHVDiua6_l0ksEopgaLMYVpn3lPY6dcqnxg7AshujRNSJ63nL7iN5xZZM0UTUG9eGxMfvvRieIHj82h23w',
    domain: '.ocgtest.es',
    path: '/',
    expires: toEpoch('2027-04-15T16:02:45.579Z'),
    httpOnly: true,
    secure: true,
    sameSite: 'None',
  },
  {
    name: 'vista-loyalty-member-authentication-token',
    value: '%7b%22ExpiryDate%22%3a%222026-04-15T20%3a03%3a18.1009805%2b00%3a00%22%2c%22isPersistent%22%3afalse%2c%22EncryptedToken%22%3a%226DCvsXIoRrkya7i1%2bAGJ6AhSCV06Ij18Hxv1PCJZ7fuurc89vLze0nFNAw6inWc6IAaArRWU6OPanSKbWCvHq%2blcaVwbqr4Bbftu4QNzizUV6RxX5WpftdUuFvXhWKKI%2bJ4FkkkcMvcSu9ZvNGASye5GwAZFTgV%2fBWvHC3UZ6RJeh9mrYHgV7D9EvaZTlTYAB9jxIceeaRkuCRGAv3uvn8KacJxIDHgsWHdhrH4jgHfhAtQD%2fUrsM4%2fUMarMBn%2f65Ble61P%2beQaWkzVDH4ATBfWjZqdzXaWHLrsREkWU4K5%2bLiAa23r61RCAIXfoaFKG2Fd%2f8Eg9VPFcXB7K32CgXBGtHkM1PcemhidAOIA9KGM%2fnpH41IQx4Svx5dc1Os8j7Mze5wM83uw5MjFK89UuDAIDzoqHT7bcnTycpKGti018Wg%2bkKQgIbeJpFMdWI1FsjYKO1XaJdFnfg9VL1Fz2G5FOJzd0QWNPtfPxkDSIPiSv5lRCHREvBSf3Rm9WzImbXl5%2bE7GRuFb%2bkkHd5yz1xHBgZ6mP3bYP%2fZuOVynMFQdBEnwjb8q3YXqTNJGrvqCVEFgrpyxmao2RzxboKF8YkOO06jwfbOejVEbibw%2bNTmOmz%2bCMiBPdNOjQyqZizmPc2aCrZ2NQGV%2fgEYBzenTzOsGLDwJ5TCY8WDM0pLI0VAMtZzJoi0c9rggqJ86Wz4lrfuUSFjfZncNY%2b3W5%2famvHqgfY0ce6cfbYEWydrxtxEXYbZdrKtxf1NUHbLhgW%2fBvhKAjVRgFvzLmXGvLNNJ8fMBc5BLdtiZ6i8IXP2M8t6Upiet7iUXTU%2bfKKuKMN1A0LePIPsiHpZonQ97fz0LfVPftcD7p1rQiXAmqbb9mb3ZUqvR4sDLJoyoHpYLpWyrgjgJlDGZA%2fyyxXnFZL8KWWhJZmGebZ8uZuUrUZar8JDhrarWOlgHLnROtsSAMNJPY%2bdZdxk%2bNgqz4v44g2FXu66Hff5jpPUAMX7tShg2VpJRhravSFUCd5TRLUQ4lfRpNesL9VHInaJPdnE5iyiP0%2bXcFegQ0xmH5BGuORBEKrzaKsBe%2bpg7%2fUueMeMdJ0xgwZHx8ijlSi48Za9ttYwAh5ke50cKTVqsgRZF6A8L%2bUTQtW04lgYw%2fO1RB6X%2bHeQquMQYLBguaS35y1xZFKcf2vLBBXU6fe9SRSxtYWCQg9ni9it5riyuKCFIWmMGa%2fEgwnHtqlTJYYTw9gaq6ea7TKXmZQ7kVs5N65r6VPG9NxxvKNY%2fj7ArThG68VgfmHjXhvrN1L0uR9P7icuAh6S61RknY1S4wK3LWRPPk8eZhkUDqJY7xmz%2b41%2fl65IUWsjND9A%2fRqKPvsWaiAXpl%2biOq0scp5XwveaUC%2frsuC%2fhBVMvIBoNl9kvs1pAp4G1PDBqAaynFtS1gDH3LXcYwZvi8T618Hj49PpFUSd0IZjsTzsBaEnC82aVCYV9I8YcYxRUlsJgLP%2bhxY6UXyAVfa44PApa024BdvFtHeMG8%2fKGd%2fN95MY1nX2wgTppfqUE68xCHr3TSU%2b743GuUJHGygE2rEjVA6vonmdbCsJcalO%2fSGJ%2fwv7UCN%2bgIDzBbTQG%2bRDM9Iqx1wURBeCEpkugX2l6NxkcK%2bYh40HNvZLyIlijn%2fmMLMNYouux4I%2bYmEaDTal1bUByQxO%2bgbf1oTSgycvpY04li1O%2fn%2bUcwDXwgmbqa2zlDG30%2blGJpvJDp9aR9VLirYKnLedQK0TLJc4gI6QIo3N%2bd%2fafU%2bW8CIx6jJ95m2uNSbxU1X15SqXFt6xMAcVl1CpR0hbbAlT0WX0Pc3QTBNXZ03aNSH9zib1T%2bTa3l5sSoxvd0%2bzqwfopvl%2b7Qucyrg4ckgAVCjw8XVP%2b3%2bc6bXou0DI8XrkZTWiRAqyh3umHJl1tqco5O5Og%2bYHIbgPQu6IH5%2fOYP1XqdPZvcSP7M5SpfbxhCrzk5q2F620scOOeBnzz5k164RXVqk1e%2fWsdf5PArbgQPpOx7ULmii30cJNyD9IAL6rZixOiPxCfD7g%2bcOgicIUZbneSiUJmPcnch6Qw9drWrZ%2bPGmVjCJkhmcJH489YLcVxHx%2fPqG5CU5hJQwKCR0u67XC3cpTuezqHI96K64IqFBe38vlAP6Gn2lQZJWWRC7Ft%2b%2bZhA%2flbAWiwjTXY0vEe6MPhc2o%2b7Hq5Pl5AjE0pjw0GX94uG6a6zaS%2beUJGQX3KxS8%2f03qAs0BS1hF2lyEGtTRSVrQ7sl4rQPlpMJwzwn8YTizoqLqjxclhvy%2fqMMewEfNJi8DeUoVBvAJd2zsry1bqNjSTjb9onMsIPbl%2fDn6cO%2fd3DRI1qebrdZsbTOhPUuZLJ5EpyEBRUGbAfhUp4UcUltmmZy9lLL%2bWelTeFCW6jKtZkx%2bLWpgy%2ffLPPUaguaSFBac895kPXNNMH7LeZ5GGMtisijqbbWnnKeSD5g31qYlm99XxstQofOOSm7N7VctyUFlFLM3EYnlBbCpDSeDXNTpwZyd%2beWNt7tfzZxcMA2U5484fc2t%2bdbFtlwCbz2Z%2fOCWcJg02AGSUEQ1cfAUbBkyN0PiQAQZJ9CwQ4Iz3xOK16YxnX41DoLEExIsdlxHUIK74HNmdzYPwkoWv6elTSNWU4QRAfHmO8LQUbsxkURpDyyHaZlVlPIMIMvGPKaTXsWoWUDGzZR5UeYtVdLA3hLADByny3i8mqoNNOpZSzsy5W0qnl6wBj3bDXYbr0vqscCVD17JwmGNXnNfqddmA9MSNg67i%2fXrc6iIWiSBZPyn5eWyq%2f%2fMgNmy1qp9z9Lu8ZyY%2fcLfQ8dRdECHXP3CeIexSbQ0jny9VZhAaHRn3YJLDKGfr5NQ1EQa7ynfgN%2b2cko0rV1swKVGgU7dpjvHY7t%2bFWC5Jr%2fpEVipzjigdu72qy0z5mIktVTchQ%2fXM7%2fjrj%2fJ97adZA1rEUMgzaAHRG6%2fpqU1yu%22%7d',
    domain: '.ocgtest.es',
    path: '/',
    expires: toEpoch('2026-04-15T20:03:17.291Z'),
    httpOnly: true,
    secure: true,
    sameSite: 'Lax',
  },
  {
    name: 'vista-loyalty-member-is-authenticated',
    value: '',
    domain: '.ocgtest.es',
    path: '/',
    expires: toEpoch('2026-04-15T20:03:17.291Z'),
    httpOnly: false,
    secure: true,
    sameSite: 'Lax',
  },
];

// ── localStorage (auth-critical entries only) ──────────────────
// The browsing/sales/seating caches are NOT needed — the app fetches fresh data.
// Only the loyalty store (memberHash) is relevant for auth recognition.
const localStorage = [
  {
    name: 'VistaOmnichannelComponents::version-number',
    value: '15.0.0',
  },
];

// ── Assemble Playwright storageState ───────────────────────────
const storageState = {
  cookies,
  origins: [
    {
      origin: 'https://preprod-web.ocgtest.es',
      localStorage,
    },
  ],
};

// ── Write ──────────────────────────────────────────────────────
const outPath = path.join(__dirname, '..', 'state', 'authenticated.preprod.es.json');
fs.mkdirSync(path.dirname(outPath), { recursive: true });
fs.writeFileSync(outPath, JSON.stringify(storageState, null, 2));

const stats = fs.statSync(outPath);
console.log(`✅ Generated: ${outPath}`);
console.log(`   Size: ${(stats.size / 1024).toFixed(1)} KB`);
console.log(`   Cookies: ${cookies.length}`);
console.log(`   localStorage entries: ${localStorage.length}`);

// Validate auth token expiry
const tokenCookie = cookies.find(c => c.name === 'vista-loyalty-member-authentication-token');
if (tokenCookie) {
  const expiresAt = new Date(tokenCookie.expires * 1000);
  const now = new Date();
  const hoursLeft = (expiresAt - now) / (1000 * 60 * 60);
  console.log(`\n⚠️  Auth token expires: ${expiresAt.toISOString()}`);
  console.log(`   Hours remaining: ${hoursLeft.toFixed(1)}`);
  if (hoursLeft < 0) {
    console.log('   ❌ TOKEN ALREADY EXPIRED — tests will fail');
  } else if (hoursLeft < 1) {
    console.log('   ⚠️  Less than 1 hour — run tests NOW');
  }
}
