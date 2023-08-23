read -p 'What is the username for the database?: ' un
read -p 'What is the password for the database?: ' ps

sed -i '' "s/.*user:.*/user: '$un',/" ./bin/dbloader.js
sed -i '' "s/.*password:.*/password: '$ps'/" ./bin/dbloader.js
sed -i '' "s/.*user:.*/user: '$un',/" ./database.js
sed -i '' "s/.*password:.*/password: '$ps'/" ./database.js

node ./bin/dbloader