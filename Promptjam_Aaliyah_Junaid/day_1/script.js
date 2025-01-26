async function fetchTokenMetadata(mint) {
  const response = await fetch(
    'https://api.helius.xyz/v0/token-metadata?api-key=c4d91ada-219b-481e-88b2-3fd7862dc36a',
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ mintAccounts: [mint] }),
    }
  );
  const data = await response.json();
  return data[0];
}

async function fetchTokens() {
  const walletAddress = document.getElementById('walletAddress').value;
  const tokensDiv = document.getElementById('tokens');
  const loadingDiv = document.getElementById('loading');

  tokensDiv.innerHTML = '';
  loadingDiv.style.display = 'flex';

  if (!walletAddress) {
    loadingDiv.style.display = 'none';
    tokensDiv.innerHTML =
      '<div class="error-message">Please enter a wallet address</div>';
    return;
  }

  try {
    const response = await fetch(
      'https://api.helius.xyz/v0/addresses/' +
        walletAddress +
        '/balances?api-key=c4d91ada-219b-481e-88b2-3fd7862dc36a'
    );
    const data = await response.json();

    if (data.tokens && data.tokens.length > 0) {
      tokensDiv.innerHTML = ''; // Clear any previous error messages
      for (const token of data.tokens) {
        if (token && token.mint) {
          const metadata = await fetchTokenMetadata(token.mint);
          console.log(metadata);

          const tokenDiv = document.createElement('div');
          tokenDiv.className = 'token';

          const img = document.createElement('img');
          img.src = metadata?.legacyMetadata?.logoURI || 'default-logo.webp';
          img.alt =
            metadata?.onChainMetadata?.metadata?.data?.name || 'Unknown Token';

          const name =
            metadata?.[0]?.legacyMetadata?.name ||
            metadata?.onChainMetadata?.metadata?.data?.name ||
            'Unknown Token';
          const symbol =
            metadata?.legacyMetadata?.symbol ||
            metadata?.onChainMetadata?.metadata?.data?.symbol ||
            '';

          const balance = document.createElement('div');
          balance.className = 'balance';
          const amount = token.amount / Math.pow(10, token.decimals);
          balance.textContent = `${amount} ${symbol}`;

          const tokenName = document.createElement('div');
          tokenName.className = 'token-name';
          tokenName.textContent = name;

          tokenDiv.appendChild(img);
          tokenDiv.appendChild(balance);
          tokenDiv.appendChild(tokenName);
          tokensDiv.appendChild(tokenDiv);
        }
      }
    } else {
      tokensDiv.innerHTML =
        '<div class="error-message">No tokens found for this address.</div>';
    }
  } catch (error) {
    console.error('Error fetching tokens:', error);
    tokensDiv.innerHTML =
      '<div class="error-message">Error fetching tokens. Please try again.</div>';
  } finally {
    loadingDiv.style.display = 'none';
  }
}
