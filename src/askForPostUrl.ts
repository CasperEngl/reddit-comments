import * as inquirer from 'inquirer';

type PostUrl = {
  url: string;
}

export const askForPostUrl = (): Promise<PostUrl> => {
  const questions = [
    {
      name: 'url',
      type: 'input',
      message: 'Reddit post url:',
      validate: (value: string): boolean | string => new RegExp(/((https?:|)\/\/|www\.)reddit\.com\/r\/[a-zA-Z]+\/comments\/[a-zA-Z0-9]+/, 'g').test(value) || 'Please paste a link to a reddit post.',
    },
  ];

  return inquirer.prompt(questions);
};
