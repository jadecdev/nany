# nany

Google Assistant challenge

To add a function:
1. add a file in the hooks folder (new_file.js)
2. add a function and export

Example:
exports.welcome = function welcome(app) {
    let now = new Date();
    app.ask(`Now is ${now}. Hello!`, 'I didn\'t hear that.');
};

3. add intent on api.ai and give an action.name

3. In the index file, in the webhook function, add your hook
actionMap.set(action.name, new_file.welcome);

4. deploy with npm run deploy


