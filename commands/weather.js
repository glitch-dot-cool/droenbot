const { weatherstack_token } = require("../config.json");
const axios = require("axios");

exports.run = async (bot, message, args) => {
  // process input args to URL friendly
  const location = encodeURI(args.join(" "));

  // await server response from query derived from input args & token from config.json
  const response = await axios.get(
    `http://api.weatherstack.com/current?access_key=${weatherstack_token}&query=${location}`
  );

  // pull off properties from server response
  const condition = response.data.current.weather_descriptions[0];
  const temp = response.data.current.temperature;
  const location_response = response.data.location.name;

  message.channel.send(
    `The weather is ${condition} and ${temp} degrees celcius in ${location_response}`
  );
};
