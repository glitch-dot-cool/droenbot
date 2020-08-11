const Discord = require("discord.js");
const { weatherstack_token } = require("../config.json");
const axios = require("axios");

exports.run = async (bot, message, args) => {
  // process input args to URL friendly
  const query = encodeURI(args.join(" "));

  // await server response from query derived from input args & token from config.json
  const response = await axios.get(
    `http://api.weatherstack.com/current?access_key=${weatherstack_token}&query=${query}`
  );

  // pull off properties from server response
  const location = response.data.location.name;
  const observation_time = response.data.location.localtime;
  const current = response.data.current;
  const icon = current.weather_icons[0];
  const condition = current.weather_descriptions[0];
  const temp = current.temperature;
  const { wind_speed, humidity, cloudcover, precip } = current;

  const embed = new Discord.MessageEmbed()
    .setTitle(
      `The weather is ${condition} and ${temp} degrees celcius in ${location}`
    )
    .setImage(icon)
    .addFields(
      { name: "temperature", value: `${temp}c` },
      { name: "precipitation", value: `${precip}mm` },
      { name: "wind speed", value: `${wind_speed}kph` },
      { name: "humidity", value: `${humidity}%` },
      { name: "cloud cover", value: `${cloudcover}%` }
    )
    .setFooter(`observation time: ${observation_time} (local)`);

  message.channel.send(embed);
};
