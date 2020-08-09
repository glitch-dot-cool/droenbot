exports.run = (bot, message, args) => {
  const activities = ["thinking", "waiting", "sacrificing goats", "sleeping", "buying wine and acid reflux tablets", "pronouncing pasta like paahhstah"]

  const current_activity = activities[Math.floor(Math.random() * activities.length)];
  message.channel.send("woulg is " + current_activity);
}
