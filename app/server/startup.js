Meteor.startup(() => {
    //loads up the stored stories
    if (Stories.find().count() === 0) {
        var xmlParser = require("./script/xmlParser");
        //get the files in the stories directory
        var fs = Npm.require("fs");
        var files = fs.readdirSync("assets/app/stories");

        //parse and store each story
        files.forEach((filePath) => {
            Stories.insert(xmlParser.loadXML("stories/" + filePath));
        });
    }
});
