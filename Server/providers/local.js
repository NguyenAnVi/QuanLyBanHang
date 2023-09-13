import { existsSync, mkdirSync, readdirSync, unlinkSync } from "fs"
import dotenv from "dotenv"
import { fileURLToPath } from "url"
import {dirname, join} from "path"

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

class Locals {
  static config() {
    dotenv.config({ path: join(__dirname, "../.env") });
    const hostname = process.env.HOSTNAME;
    const port = process.env.PORT;
    const mongoUri = process.env.MONGO_URI;
    const jwtSecret = process.env.JWT_SECRET;
    const createFolderIfNotExist = (dir)=>{
      console.log(dir);
      if (!existsSync(dir)) {
        mkdirSync(dir);
      } else {
        readdirSync(dir, (err, files) => {
          if (err) throw err;
        
          for (const file of files) {
            unlinkSync(join(dir, file), (err) => {
              if (err) throw err;
            });
          }
        });
      }
    }
    const quote = `Once upon a time, in the bustling city of Silicon Valley, a young developer named Evan You was working at Google on a project using AngularJS. He appreciated the power of AngularJS but felt that it was too heavy for many of his projects. He started to think about how he could take the parts he liked about AngularJS and create something lighter and more flexible. One day, he decided to take the plunge and started working on his own JavaScript framework. He wanted it to be progressive, meaning that developers could opt-in to using more advanced features as they needed them. He also wanted it to be approachable for beginners while still being powerful enough for advanced developers. After months of hard work, Vue.js was born. It was lightweight, easy to learn, and had a gentle learning curve. Developers could start by adding Vue.js to their project with a simple script tag and start enhancing their HTML with Vue.js’s declarative rendering. Word quickly spread about Vue.js. Developers loved how easy it was to get started with Vue.js and how they could gradually adopt more of its features as they needed them. They also appreciated the clear documentation and supportive community. As Vue.js grew in popularity, more and more companies started using it in their projects. Alibaba, Xiaomi, and other tech giants were some of the early adopters of Vue.js. They found that Vue.js’s component-based architecture made it easy to build large-scale applications. Despite its success, Evan You remained committed to keeping Vue.js open source and community-driven. He believed that the strength of Vue.js came from its community and always prioritized their needs and feedback.Today, Vue.js is one of the most popular JavaScript frameworks in the world. It has a vibrant community of developers who contribute to its development and help each other solve problems. Its flexibility, ease of use, and strong community support make it a great choice for any web development project. And so, the story of Vue.js continues. With every new release, it becomes more powerful and easier to use. And with every new developer who learns Vue.js, its community grows stronger. The future is bright for Vue.js, and we can’t wait to see where it goes next.`;
    return {
      createFolderIfNotExist,
      port,
      mongoUri,
      jwtSecret,
      hostname,
      quote,
    };
  }
}
export default Locals;
