exports.run = (bot, message, args) => {
  const [lennyID] = args;

  const lennies = [
    "( ͡° ͜ʖ ͡°)",
    "(ಥ ͜ʖಥ)",
    "(☞ຈل͜ຈ)☞",
    "ヽ༼ຈل͜ຈ༽ﾉ",
    "(⌐▀͡ ̯ʖ▀)",
    "( ͡°ω ͡°)",
    "ᕙ(▀̿̿Ĺ̯̿̿▀̿ ̿) ᕗ",
    "̿̿ ̿̿ ̿̿ ̿'̿'̵͇̿̿з= ( ▀ ͜͞ʖ▀) =ε/̵͇̿̿/’̿’̿ ̿ ̿̿ ̿̿ ̿̿",
    "ᕕ( ཀ ʖ̯ ཀ)ᕗ",
    "(☞ຈل͜ຈ)☞",
    "( ͡ಠ ʖ̯ ͡ಠ)",
    "ლ(▀̿̿Ĺ̯̿̿▀̿ლ)",
    "(∩ ͡° ͜ʖ ͡°)⊃━☆ﾟ",
    "╭∩╮( ͡° ل͟ ͡° )╭∩╮",
  ];

  // can't delete msgs in dms
  if (message.channel.type !== "dm") {
    message.delete();
  }

  if (lennyID && typeof lennyID === "number") {
    const index = clamp(0, lennies.length, lennyID);
    message.channel.send(lennies[index]);
  } else {
    const random_lenny = lennies[Math.floor(Math.random() * lennies.length)];
    message.channel.send(random_lenny);
  }

  function clamp(min, max, value) {
    if (value < min) {
      value = min;
    } else if (value > max) {
      value = max;
    }
    return value;
  }
};
