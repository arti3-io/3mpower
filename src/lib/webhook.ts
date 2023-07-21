const axios = require('axios');

const joinWebhook = async (
  list: string,
  user: { name: string; twitterUserId: string }
) => {
  const template = {
    content: null,
    embeds: [
      {
        color: 5814783,
        description: `[${user.name}](https://twitter.com/intent/user?user_id=${user.twitterUserId}) has queued for list [${list}](https://twitter.com/i/lists/${user.twitterUserId})`,
      },
    ],
    username: '3MPOWER Join Queue',
    avatar_url:
      'https://pbs.twimg.com/profile_images/1681248600951754754/g4hBuv95_400x400.jpg',
    attachments: [],
  };
  try {
    const webhookURL =
      'https://discord.com/api/webhooks/1131190669717815406/TVoRGYk5etq1Ui3FuykOXU_RejtinQI0OvpmtXgd_Fi6B_GWZEZsnlQWUFxg3Zq6R3Jz';

    const response = await axios.post(webhookURL, template);

    return response.data;
  } catch (error) {
    console.error('Failed to send webhook:', error);
    throw error;
  }
};

const errorWebhook = async (
  list: string,
  user: { name: string; twitterUserId: string }
) => {
  const template = {
    content: null,
    embeds: [
      {
        color: 5814783,
        description: `🚨 [${user.name}](https://twitter.com/intent/user?user_id=${user.twitterUserId}) has queued for list [${list}](https://twitter.com/i/lists/${user.twitterUserId}) and encountered an error 🚨`,
      },
    ],
    username: '3MPOWER Join Queue',
    avatar_url:
      'https://pbs.twimg.com/profile_images/1681248600951754754/g4hBuv95_400x400.jpg',
    attachments: [],
  };
  try {
    const webhookURL =
      'https://discord.com/api/webhooks/1131190669717815406/TVoRGYk5etq1Ui3FuykOXU_RejtinQI0OvpmtXgd_Fi6B_GWZEZsnlQWUFxg3Zq6R3Jz';

    const response = await axios.post(webhookURL, template);

    return response.data;
  } catch (error) {
    console.error('Failed to send webhook:', error);
    throw error;
  }
};
