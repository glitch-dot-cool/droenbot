exports.run = (bot, message, args) => {
  const input = args.slice(0).join(" ").toLowerCase().split("");
  let string = "";
  const dict = {
    " ": "  ",
    b: ":b:",
    1: ":one:",
    2: ":two:",
    3: ":three:",
    4: ":four:",
    5: ":five:",
    6: ":six:",
    7: ":seven:",
    8: ":eight:",
    9: ":nine:",
    0: ":zero:",
    "!": ":grey_exclamation:",
    "?": ":grey_question:",
  };

  for (var i = 0; i < input.length; i++) {
    const char = input[i];
    string += dict[char] || letter_to_emoji(char);
  }

  message.delete();
  message.channel.send(`${message.member.displayName}: ${string}`);
};

function letter_to_emoji(letter) {
  const letters = /^[A-Za-z]+$/;

  try {
    if (letters.test(letter)) {
      return `:regional_indicator_${letter}:`;
    } else {
      return "";
    }
  } catch (error) {
    console.log(error);
  }
}
