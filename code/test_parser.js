function parseJewelryTitle(title, productType) {
  title = title || '';
  const isRing = /anillo/i.test(title) || /anillo/i.test(productType || '');
  const isChain = /cadena/i.test(title) || /collar/i.test(title) || /cuban/i.test(title);
  const isBracelet = /pulsera/i.test(title) || /esclava/i.test(title) || /brazalete/i.test(title);
  const isEarring = /arete/i.test(title) || /arracada/i.test(title) || /topos/i.test(title);
  const isPendant = /dije/i.test(title) || /medalla/i.test(title) || /cruz/i.test(title);

  // Karat detection
  let karat = '14k';
  if (/\b10k\b/i.test(title)) karat = '10k';
  else if (/\b14k\b/i.test(title)) karat = '14k';

  // Extract tokens
  let clean = title.replace(/\b10k\b|\b14k\b/gi, ' ');
  let numMatches = clean.match(/\b\d+(?:\.\d+)?(?:g|gr|gramos)?\b/gi) || [];
  
  let weight = null;
  let size = null;

  // Check if any token has 'g' or 'gr'
  for (let t of numMatches) {
    if (/g|gr|gramos/i.test(t)) {
      weight = parseFloat(t);
    }
  }

  let remainingNums = numMatches.map(t => parseFloat(t)).filter(n => !isNaN(n) && n !== weight);

  if (isRing) {
    if (remainingNums.length >= 2) {
      if (remainingNums[0] >= 4 && remainingNums[0] <= 14) {
        size = 'Talla ' + remainingNums[0];
        weight = weight || remainingNums[1];
      } else {
        weight = weight || remainingNums[0];
        size = 'Talla ' + remainingNums[1];
      }
    } else if (remainingNums.length === 1) {
      if (remainingNums[0] >= 4 && remainingNums[0] <= 14 && !weight) {
        size = 'Talla ' + remainingNums[0];
      } else {
        weight = weight || remainingNums[0];
      }
    }
  } else if (isChain) {
    if (remainingNums.length >= 2) {
      let len = remainingNums.find(n => [16, 18, 20, 22, 24, 26, 28, 30].includes(Math.round(n)));
      if (len) {
        size = len + '" (' + Math.round(len * 2.54) + ' cm)';
        weight = weight || remainingNums.find(n => n !== len);
      } else {
        size = remainingNums[0] + '"';
        weight = weight || remainingNums[1];
      }
    } else if (remainingNums.length === 1) {
      if ([16, 18, 20, 22, 24, 26, 28, 30].includes(Math.round(remainingNums[0]))) {
        size = remainingNums[0] + '" (' + Math.round(remainingNums[0] * 2.54) + ' cm)';
      } else {
        weight = weight || remainingNums[0];
      }
    }
  } else if (isBracelet) {
    if (remainingNums.length >= 2) {
      size = remainingNums[0] + '"';
      weight = weight || remainingNums[1];
    } else if (remainingNums.length === 1) {
      if (remainingNums[0] >= 6 && remainingNums[0] <= 10) {
        size = remainingNums[0] + '"';
      } else {
        weight = weight || remainingNums[0];
      }
    }
  } else {
    if (remainingNums.length >= 2) {
      size = remainingNums[0] + ' mm';
      weight = weight || remainingNums[1];
    } else if (remainingNums.length === 1) {
      weight = weight || remainingNums[0];
    }
  }

  return { karat, size, weight };
}

const tests = [
  'Anillo Hollow 10K 6.5 3.86',
  'Anillo Solitario 14K 7 4.20',
  'Cadena Cuban Miami Solid 14K 22 64.2',
  'Cadena Franco 10K 24 14.8g',
  'Pulsera Rolex 10K 8.0 12.5',
  'Medalla San Judas 14K 35mm 5.8g',
  'Arracadas Tubulares 10K 30mm 4.1'
];

tests.forEach(t => console.log(t, '->', parseJewelryTitle(t)));
