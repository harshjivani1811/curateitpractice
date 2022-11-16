require("dotenv").config();
const mql = require("@microlink/mql");
const axios = require("axios");
const puppeteer = require("puppeteer");
const multer = require("multer");
const getColors = require("get-image-colors");
const { findPhoneNumbersInText } = require("libphonenumber-js");
const sanitizeHtml = require("sanitize-html");
// const figlet = require('figlet');
const { Readability } = require("@mozilla/readability");
const { JSDOM } = require("jsdom");

exports.micro = async (req, res) => {
  try {
    if (!req.query.url) {
      res.send("Please provide a valid URL");
      throw new Error();
    }

    const { status, data, response } = await mql(req.query.url);

    console.log("data", data);
    res.send(data);
  } catch (error) {
    res.send(error);
  }
};

exports.iframely = async (req, res) => {
  try {
    if (!req.query.url) {
      res.send("Please provide a valid URL");
      throw new Error();
    }

    const API_KEY = "ce85ecff19fbd7dba1cf97";

    const iframely = await axios.get(
      `https://iframe.ly/api/iframely?url=${req.query.url}/&api_key=${process.env.IFRAMELY_API_KEY}&iframe=1&omit_script=1`
    );

    // console.log(iframely.data)
    res.send(iframely.data);
  } catch (error) {
    res.send(error);
  }
};

exports.embed = async (req, res) => {
  try {
    if (!req.query.url) {
      res.send("Please provide a valid URL");
      throw new Error();
    }

    const API_KEY = "ce85ecff19fbd7dba1cf97";
    const embed = await axios.get(
      `https://iframe.ly/api/oembed?url=${req.query.url}/&api_key=${API_KEY}&iframe=1&omit_script=1`
    );

    console.log(embed.data.html);
    res.send(embed.data);
  } catch (error) {
    res.send(error);
  }
};

const healtcheckData = async ({ query, page, response }) => ({
  url: response && response.url(),
  statusCode: response && response.status(),
  // headers: response && response.headers(),
  // html: await page.content()
});

exports.healthCheck = async (req, res) => {
  try {
    if (!req.query.url) {
      res.send("Please provide a valid URL");
      throw new Error();
    }

    const API_KEY = "9hYBCgRn1P5WpCgIpmcRf7tk785f30P87piR5Ikc";
    const { data } = await mql(req.query.url, {
      apiKey: API_KEY,
      function: healtcheckData.toString(),
      meta: false,
    });

    console.log("data");
    res.send(data);
  } catch (error) {
    res.send(error);
  }
};

exports.screenshot = async (req, res) => {
  try {
    if (!req.query.url) {
      res.send("Please provide a valid URL");
      throw new Error();
    }

    const API_KEY = "9hYBCgRn1P5WpCgIpmcRf7tk785f30P87piR5Ikc";
    const { data } = await mql(req.query.url, {
      apiKey: API_KEY,
      meta: false,
      screenshot: true,
    });

    res.send(data.screenshot);
  } catch (error) {
    res.send(error);
  }
};

exports.fullScreenshot = async (req, res) => {
  try {
    if (!req.query.url) {
      res.send("Please provide a valid URL");
      throw new Error();
    }

    const API_KEY = "9hYBCgRn1P5WpCgIpmcRf7tk785f30P87piR5Ikc";
    const { data } = await mql(req.query.url, {
      apiKey: API_KEY,
      meta: false,
      screenshot: true,
      fullpage: true,
    });

    res.send(data.screenshot);
  } catch (error) {
    res.send(error);
  }
};

exports.technologyStack = async (req, res) => {
  try {
    if (!req.query.url) {
      res.send("Please provide a valid URL");
      throw new Error();
    }

    const API_KEY = "9hYBCgRn1P5WpCgIpmcRf7tk785f30P87piR5Ikc";
    const { data } = await mql(req.query.url, {
      apiKey: API_KEY,
      meta: false,
      insights: {
        lighthouse: false,
        technologies: true,
      },
    });

    res.send(data.insights.technologies);
  } catch (error) {
    res.send(error);
  }
};

exports.twitter = async (req, res) => {
  try {
    if (!req.query.url) {
      res.send("Please provide a valid URL");
      throw new Error();
    }

    const API_KEY = "9hYBCgRn1P5WpCgIpmcRf7tk785f30P87piR5Ikc";
    const { data } = await mql(req.query.url, {
      apiKey: API_KEY,
      data: {
        banner: {
          selector: 'main a[href$="header_photo"] img',
          attr: "src",
          type: "image",
        },
        stats: {
          selector: "main",
          attr: {
            tweets: {
              selector: "div > div > div > div h2 + div",
            },
            followings: {
              selector: 'a[href*="following"] span span',
            },
            followers: {
              selector: 'a[href*="followers"] span span',
            },
          },
        },
        latestTweets: {
          selectorAll: "main article",
          attr: {
            content: {
              selector: "div[lang]",
              attr: "text",
            },
            link: {
              selector: "a",
              attr: "href",
            },
          },
        },
      },
      prerender: true,
      waitForSelector: "main article",
    });
    res.send(data);
  } catch (error) {
    res.send(error);
  }
};

exports.email = async (req, res) => {
  try {
    console.log("start", req.query.url);
    if (!req.query.url) {
      res.send("Please provide a valid URL");
      throw new Error();
    }
    console.log("call");
    const API_KEY = "9hYBCgRn1P5WpCgIpmcRf7tk785f30P87piR5Ikc";
    const { data } = await mql(req.query.url, {
      apiKey: API_KEY,
      meta: false,
      data: {
        emails: {
          selector: "body",
          type: "email",
        },
      },
    });

    console.log("after", data.emails);

    res.send(data.emails);
  } catch (error) {
    res.send(error);
  }
};

exports.youtube = async (req, res) => {
  try {
    if (!req.query.url) {
      res.send("Please provide a valid URL");
      throw new Error();
    }
    console.log("youtubr");
    const API_KEY = "9hYBCgRn1P5WpCgIpmcRf7tk785f30P87piR5Ikc";
    const { data } = await mql(req.query.url, {
      apiKey: API_KEY,
      prerender: true,
      video: true,
      audio: true,
      data: {
        views: {
          selector: ".view-count",
          type: "number",
        },
      },
    });
    console.log("data");
    res.send(data);
  } catch (error) {
    res.send(error);
  }
};

exports.tiktok = async (req, res) => {
  try {
    if (!req.query.url) {
      res.send("Please provide a valid URL");
      throw new Error();
    }

    const API_KEY = "9hYBCgRn1P5WpCgIpmcRf7tk785f30P87piR5Ikc";
    const { data } = await mql(req.query.url, {
      apiKey: API_KEY,
      data: {
        song: {
          selector: 'h4[data-e2e="browse-music"]',
          attr: "text",
          type: "string",
        },
        likeCount: {
          selector: 'strong[data-e2e="like-count"]',
          attr: "text",
          type: "string",
        },
        commentCount: {
          selector: 'strong[data-e2e="comment-count"]',
          attr: "text",
          type: "string",
        },
        shareCount: {
          selector: 'strong[data-e2e="share-count"]',
          attr: "text",
          type: "string",
        },
      },
    });

    res.send(data);
  } catch (error) {
    res.send(error);
  }
};

exports.instagram = async (req, res) => {
  try {
    if (!req.query.url) {
      res.send("Please provide a valid URL");
      throw new Error();
    }

    const API_KEY = "9hYBCgRn1P5WpCgIpmcRf7tk785f30P87piR5Ikc";
    const { data } = await mql(req.query.url, {
      apiKey: API_KEY,
      data: {
        avatar: {
          selector: 'meta[property="og:image"]',
          attr: "content",
          type: "image",
        },
        stats: {
          selector: 'meta[property="og:description"]',
          attr: "content",
        },
      },
    });

    res.send(data);
  } catch (error) {
    res.send(error);
  }
};

exports.amazon = async (req, res) => {
  try {
    if (!req.query.url) {
      res.send("Please provide a valid URL");
      throw new Error();
    }

    const API_KEY = "9hYBCgRn1P5WpCgIpmcRf7tk785f30P87piR5Ikc";
    const { data } = await mql(req.query.url, {
      apiKey: API_KEY,
      data: {
        price: {
          selector: "#attach-base-product-price",
          attr: "val",
          type: "number",
        },
        currency: {
          selector: "#featurebullets_feature_div",
          attr: "val",
        },
      },
    });

    res.send(data);
  } catch (error) {
    res.send(error);
  }
};

exports.imdb = async (req, res) => {
  try {
    if (!req.query.url) {
      res.send("Please provide a valid URL");
      throw new Error();
    }

    const API_KEY = "9hYBCgRn1P5WpCgIpmcRf7tk785f30P87piR5Ikc";
    const { data } = await mql(req.query.url, {
      apiKey: API_KEY,
      data: {
        director: {
          selector: ".ipc-metadata-list__item:nth-child(1) a",
          type: "text",
        },
        writer: {
          selector: ".ipc-metadata-list__item:nth-child(2) a",
          type: "text",
        },
        duration: {
          selector: '.ipc-inline-list__item[role="presentation"]:nth-child(3)',
          type: "text",
        },
        year: {
          selector:
            '.ipc-inline-list__item[role="presentation"]:nth-child(1) span',
          type: "number",
        },
        rating: {
          selector: ".rating-bar__base-button .ipc-button__text span",
          type: "text",
        },
        ratingCount: {
          selector:
            ".rating-bar__base-button .ipc-button__text div:nth-child(3)",
          type: "text",
        },
      },
    });

    res.send(data);
  } catch (error) {
    res.send(error);
  }
};

exports.productHunt = async (req, res) => {
  try {
    if (!req.query.url) {
      res.send("Please provide a valid URL");
      throw new Error();
    }

    const API_KEY = "9hYBCgRn1P5WpCgIpmcRf7tk785f30P87piR5Ikc";
    const { data } = await mql(req.query.url, {
      apiKey: API_KEY,
      data: {
        reviews: {
          selector: 'div div div div div div a[href$="reviews"]',
        },
      },
    });

    res.send(data);
  } catch (error) {
    res.send(error);
  }
};

exports.reddit = async (req, res) => {
  try {
    if (!req.query.url) {
      res.send("Please provide a valid URL");
      throw new Error();
    }

    const API_KEY = "9hYBCgRn1P5WpCgIpmcRf7tk785f30P87piR5Ikc";
    const { data } = await mql(req.query.url, {
      apiKey: API_KEY,
      data: {
        karma: {
          selector: "#profile--id-card--highlight-tooltip--karma",
        },
        birthday: {
          selector: "#profile--id-card--highlight-tooltip--cakeday",
        },
        avatar: {
          selector: 'img[alt="User avatar"]',
          attr: "src",
          type: "url",
        },
      },
    });

    res.send(data);
  } catch (error) {
    res.send(error);
  }
};

exports.soundCloud = async (req, res) => {
  try {
    if (!req.query.url) {
      res.send("Please provide a valid URL");
      throw new Error();
    }

    const API_KEY = "9hYBCgRn1P5WpCgIpmcRf7tk785f30P87piR5Ikc";
    const { data } = await mql(req.query.url, {
      apiKey: API_KEY,
      prerender: true,
      audio: true,
      data: {
        plays: {
          selector: ".sc-ministats-plays .sc-visuallyhidden",
          type: "number",
        },
      },
    });

    res.send(data);
  } catch (error) {
    res.send(error);
  }
};

exports.spotify = async (req, res) => {
  try {
    if (!req.query.url) {
      res.send("Please provide a valid URL");
      throw new Error();
    }

    const API_KEY = "9hYBCgRn1P5WpCgIpmcRf7tk785f30P87piR5Ikc";
    const { data } = await mql(req.query.url, {
      apiKey: API_KEY,
      audio: true,
    });

    res.send(data);
  } catch (error) {
    res.send(error);
  }
};

exports.github = async (req, res) => {
  try {
    if (!req.query.url) {
      res.send("Please provide a valid URL");
      throw new Error();
    }

    const API_KEY = "9hYBCgRn1P5WpCgIpmcRf7tk785f30P87piR5Ikc";
    const { data } = await mql(req.query.url, {
      apiKey: API_KEY,
      data: {
        stats: {
          selector: ".application-main",
          attr: {
            followers: {
              selector:
                '.js-profile-editable-area a[href*="tab=followers"] span',
              type: "number",
            },
            following: {
              selector:
                '.js-profile-editable-area a[href*="tab=following"] span',
              type: "number",
            },
            stars: {
              selector:
                '.js-responsive-underlinenav a[data-tab-item="stars"] span',
              type: "number",
            },
          },
        },
      },
    });

    res.send(data);
  } catch (error) {
    res.send(error);
  }
};

exports.html = async (req, res) => {
  try {
    if (!req.query.url) {
      res.send("Please provide a valid URL");
      throw new Error();
    }

    const API_KEY = "9hYBCgRn1P5WpCgIpmcRf7tk785f30P87piR5Ikc";
    const { data } = await mql(req.query.url, {
      apiKey: API_KEY,
      meta: false,
      data: {
        html: {
          selector: "html",
        },
      },
    });
    console.log(data.html);
    res.send(data.html);
  } catch (error) {
    res.send(error);
  }
};

exports.text = async (req, res) => {
  try {
    const browser = await puppeteer.launch({
      headless: true,
    });
    const page = (await browser.pages())[0];
    await page.goto(req.query.url);

    const extractedText = await page.$eval("*", (el) => el.innerText);
    res.send(extractedText);

    await browser.close();
  } catch (error) {
    res.send(error);
  }
};

exports.link = async (req, res) => {
  try {
    const browser = await puppeteer.launch({
      headless: true,
    });
    const page = (await browser.pages())[0];

    await page.goto(req.query.url);

    const hrefs = await page.$$eval("a", (as) => as.map((a) => a.href));

    res.send(hrefs);

    await browser.close();
  } catch (error) {
    res.send(error);
  }
};

const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
});

// exports.imageColor = async (req, res) => {
//     try {
//         console.log(req.body.imageFile);
//         upload.single("imageFile")(req, res => {
//             getColors(req.body.imageFile).then(colors => {
//             // `colors` is an array of color objects
//                 let col = [];
//                 colors.map(color => {
//                     console.log(color.hex());
//                     col.push(color.hex());
//                 });
//                 res.send(col);
//             })
//         });
//     } catch (error) {
//         res.send(error);
//     }
// };

exports.imageColor = async (req, res) => {
  try {
    upload.single("imgFile")(req, res, (err) => {
      console.log(req.body.imgFile);
      getColors(req.body.imgFile).then((colors) => {
        // `colors` is an array of color objects
        let col = [];
        colors.map((color) => {
          console.log(color.hex());
          col.push(color.hex());
        });
        res.send(col);
      });
    });
  } catch (error) {
    res.send(error);
  }
};

exports.webcontact = async (req, res) => {
  try {
    if (!req.query.url) {
      res.send("Please provide a valid URL");
      throw new Error();
    }
    const result = await axios.get(
      `https://website-contacts.whoisxmlapi.com/api/v1?apiKey=${process.env.WEB_CONTACT_KEY}&domainName=${req.query.url}`
    );
    let data = {
      emails: result.data.emails,
      phones: result.data.phones,
    };
    res.send(data);
  } catch (error) {
    console.log(error);
    res.send(error);
  }
};

exports.sociallink = async (req, res) => {
  try {
    if (!req.query.url) {
      res.send("Please provide a valid URL");
      throw new Error();
    }
    const result = await axios.get(
      `https://website-contacts.whoisxmlapi.com/api/v1?apiKey=at_rvM3kx8cyWkQnuiy8U3siTNWCNj1k&domainName=${req.query.url}`
    );

    res.send(result.data.socialLinks);
  } catch (error) {
    res.send(error);
  }
};

exports.digitalRank = async (req, res) => {
  try {
    console.log("Call");
    const SIMILAR_RANK_API_KEY = "5125cc30ce0a41f2ba1e042f15fc252b";
    // console.log(req.query.url.slice(8), " req.query.url")
    // let url = req.query.url.slice(8)
    // const result = await axios.get(`https://api.similarweb.com/v1/similar-rank/${url}/rank?api_key=${SIMILAR_RANK_API_KEY}`)
    let digitalRes;
    if (req.query.url.startsWith("https://www.")) {
      const digitalRankData = await axios.get(
        `https://api.similarweb.com/v1/similar-rank/${req.query.url.slice(
          12
        )}/rank?api_key=${SIMILAR_RANK_API_KEY}`
      );
      digitalRes = digitalRankData;
    } else if (req.query.url.startsWith("https://")) {
      const digitalRankData = await axios.get(
        `https://api.similarweb.com/v1/similar-rank/${req.query.url.slice(
          8
        )}/rank?api_key=${SIMILAR_RANK_API_KEY}`
      );
      digitalRes = digitalRankData;
    } else if (req.query.url.startsWith("www.")) {
      const digitalRankData = await axios.get(
        `https://api.similarweb.com/v1/similar-rank/${req.query.url.slice(
          4
        )}/rank?api_key=${SIMILAR_RANK_API_KEY}`
      );
      digitalRes = digitalRankData;
    } else {
      const digitalRankData = await axios.get(
        `https://api.similarweb.com/v1/similar-rank/${req.query.url}/rank?api_key=${SIMILAR_RANK_API_KEY}`
      );
      digitalRes = digitalRankData;
    }
    console.log("data", digitalRes.data);
    res.send(digitalRes.data);
  } catch (error) {
    console.log("error", error);
  }
};

exports.phoneNumber = async (req, res) => {
  try {
    console.log("hello");

    const browser = await puppeteer.launch({
      headless: true,
    });
    const page = (await browser.pages())[0];
    await page.goto(req.query.url);
    const hrefs = await page.$$eval("a", (as) => as.map((a) => a.href));
    const text = hrefs.toString();
    await browser.close();

    const data = findPhoneNumbersInText(text);
    test = data.map((number) => number.number.number);
    // const test = JSON.stringify(data)
    console.log(test, "number");
    res.send(test);
  } catch (error) {
    console.log(error);
  }
};

exports.fontDetails = async (req, res) => {
  try {
    const browser = await puppeteer.launch({
      headless: true,
    });
    const page = (await browser.pages())[0];
    await page.goto(req.query.url);
    const extractedText = await page.$eval("*", (el) => el.innerText);
    // res.send(extractedText);
    await browser.close();

    // console.log("hello........................",detectFont(extractedText));

    // var d = new Detector();
    // d.detect('font name');

    // fontList.getFonts(extractedText)
    // .then(font => {
    //   res.send(font)
    // })
    // .catch(err => {
    //   console.log(err)
    // })

    // const systemFonts = new SystemFonts();

    // // asynchronous
    // systemFonts.getFonts().then(
    //   (res) => {
    //     console.log(res);
    //   },
    //   (err) => {
    //     console.log(err);
    //   }// handle the error
    // );

    figlet(extractedText, function (err, data) {
      if (err) {
        console.log("Something went wrong...");
        console.dir(err);
        return;
      }
      console.log(data);
    });

    // var font = fontkit.open(extractedText)

    // // var run = font.layout('hello world!');

    // // var svg = font.glyphs[0].path.toSVG();

    // var subset = font.createSubset();
    // font.glyphs.forEach(function(glyph) {
    //   subset.includeGlyph(glyph);
    // });

    // let buffer = subset.encode();
    // console.log("buffer", buffer);

    // const files = await getSystemFonts();

    // res.send(files);
  } catch (error) {
    console.log(error);
  }
};

exports.category = async (req, res) => {
  try {
    if (!req.query.url) {
      res.send("Please provide a valid URL");
      throw new Error();
    }
    const result = await axios.get(
      `https://website-categorization.whoisxmlapi.com/api/v2?apiKey=${process.env.WEB_CONTACT_KEY}&domainName=${req.query.url}`
    );
    let cat = [];
    result.data.categories.map((data) => {
      // console.log("category1", data.tier1,"category2", data.tier2);
      // cat.push(data.tier1.name)
      // console.log("cat araay", data.tier2.name);
      if (data.tier1 === null) {
        cat;
      } else {
        console.log("category1", data.tier1.name);
        cat.push(data.tier1.name);
      }

      if (data.tier2 === null) {
        cat;
      } else {
        console.log("category2", data.tier2.name);
        cat.push(data.tier2.name);
      }
    });
    console.log("car", cat);
    res.send(cat);
    // res.send(result.data.categories);
  } catch (error) {
    res.send(error);
  }
};

const code = async ({ url, html }) => {
  const { Readability } = require("@mozilla/readability");
  const { JSDOM, VirtualConsole } = require("jsdom");

  const dom = new JSDOM(html, {
    url,
    virtualConsole: new VirtualConsole(),
  });

  const reader = new Readability(dom.window.document);
  return reader.parse().excerpt;
};
const excerpts = (url, props) => {
  return mql(url, { function: code.toString(), meta: false, ...props }).then(
    ({ data }) => data.function
  );
};
exports.excerpt = async (req, res) => {
  try {
    if (!req.query.url) {
      res.send("Please provide a valid URL");
      throw new Error();
    }
    const result = await excerpts(req.query.url);
    res.send(result);
  } catch (error) {
    res.send(error);
  }
};

// exports.htmltag = async (req, res) => {
//     try {
//         const API_KEY = '9hYBCgRn1P5WpCgIpmcRf7tk785f30P87piR5Ikc';
//         const { data } = await mql(req.query.url,
//             {
//                 apiKey: API_KEY,
//                 meta: false,
//                 data: {
//                     html: {
//                         selector: 'html'
//                     }
//                 },
//             })

//         // const htmldata = sanitizeHtml(data.html)
//         // res.send(htmldata)
//         // console.log(htmldata);

//         // // const dirty = data.html;
//         // const clean = sanitizeHtml(data.html, {
//         //     allowedTags: [ 'ul', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'p' ],
//         //   });
//         // console.log("html with text ===>" ,clean);
//         //   res.send(clean)

//         const root = parse(data.html)
//         const htmldata = root.getElementsByTagName('p')
//         res.send(htmldata.toString());
//         console.log("html tag", htmldata.toString())

//     } catch (error) {
//         console.log(error);
//     }
// }

// exports.htmltag = async (req, res) => {
//     try {
//         const options = {

//             method: 'POST',
//             url: 'https://on-page-seo-audit.p.rapidapi.com/page-audit',
//             headers: {
//                 'content-type': 'application/json',
//                 'X-RapidAPI-Key': 'b9ab90b091mshb0eafe2f3c00e44p1f0529jsn678eea650d21',
//                 'X-RapidAPI-Host': 'on-page-seo-audit.p.rapidapi.com'
//             },
//             // data: req.query.url
//             data: '{"url":"https://mobiosolutions.com"}'
//             // data: `{"url": ${req.query.url}}`
//         };
//         console.log("option----------------", options);
//         axios.request(options).then(function (response) {
//             console.log("call");
//             console.log(response.data);
//             res.send(response.data);
//             console.log("after");
//         }).catch(function (error) {
//             console.error("eroor =============", error);
//         });
//     } catch (error) {
//         console.log(error);
//     }
// }

exports.htmltag = async (req, res) => {
  try {
    const API_KEY = "9hYBCgRn1P5WpCgIpmcRf7tk785f30P87piR5Ikc";
    const { data } = await mql(req.query.url, {
      apiKey: API_KEY,
      meta: false,
      data: {
        html: {
          selector: "html",
        },
      },
    });

    const htmldata = sanitizeHtml(data.html);
    // console.log(htmldata);

    const doc = new JSDOM(htmldata, { url: req.query.url });
    let reader = new Readability(doc.window.document);
    let article = reader.parse();
    res.send(article);
    console.log("article---------------", article);
  } catch (error) {
    console.log(error);
  }
};

// const axios = require("axios");

// const storage = multer.memoryStorage();
// const upload = multer({
//     storage: storage
// });

const storageimg = multer.diskStorage({
  destination: async (req, file, cb) => {
    cb(null, "./upload");
  },
  filename: (req, file, cb) => {
    cb(null, uuidv4() + file.originalname.replace(/ /g, ""));
  },
});
const uploadimg = multer({
  storage: storageimg,
});
exports.ocr = async (req, res) => {
  try {
    // const data = new FormData();
    // uploadimg.single("imgFile")(req, res, (err) => {
    //     console.log("hello", req.body.imgFile);
    //     console.log("image uploaded");
    // })

    // ReadText('/upload/1ba52e46-b5bd-41f0-91d6-779c6e60fda5philly.jpg').then((text) => {
    //     console.log("image",text);
    // }).catch(err => {
    //     console.log(err);
    // })
    // console.log("after");
    // console.log("call");
    // tesseract.process(__dirname + '/upload/c97e0371-84a1-408f-9bc6-db7c7c183ba2philly.jpg',function(err, text) {
    //     if(err) {
    //         console.error(err);
    //     } else {
    //         console.log(text);
    //     }
    // });

    // data.append("image",);
    // data.append("imgFile", '/upload/e74603e6-f370-48f2-b47d-02be799961b9imagetxt.webp')
    // console.log("data", data);

    // const options = {
    //     method: 'POST',
    //     url: 'https://ocr-extract-text.p.rapidapi.com/ocr',
    //     headers: {
    //         'X-RapidAPI-Key': '3e477df0c6msh883c3ad03790c8dp181772jsnc333727a2780',
    //         'X-RapidAPI-Host': 'ocr-extract-text.p.rapidapi.com',
    //         ...data.getHeaders()
    //     },
    //     data: data
    // };

    // axios.request(options).then(function (response) {
    //     console.log("imagetext", response.data);
    // }).catch(function (error) {
    //     console.error("eror", error);
    // });.

    // const config = {
    //     lang: "eng",
    //     oem: 1,
    //     psm: 3,
    // }

    // tesseract
    //     .recognize("image.webp", config)
    //     .then((text) => {
    //         console.log("Result:", text)
    //     })
    //     .catch((error) => {
    //         console.log(error.message)
    //     })

    Tesseract.recognize(
      "https://tesseract.projectnaptha.com/img/eng_bw.png",
      "eng",
      { logger: (m) => console.log(m) }
    ).then(({ data: { text } }) => {
      console.log(text);
    });
  } catch (error) {
    console.log(error);
  }
};

exports.multiAPI = async (req, res) => {
  try {
    const healtcheckData = async ({ query, page, response }) => ({
        url: response && response.url(),
        statusCode: response && response.status(),
        // headers: response && response.headers(),
        // html: await page.content()
      });

    let [embed, socialllink, healthCheck, screenshot, fullscreenshot, technologyStack] = await Promise.allSettled([
        await axios.get(
            `https://iframe.ly/api/oembed?url=${req.query.url}/&api_key=ce85ecff19fbd7dba1cf97&iframe=1&omit_script=1`
          ),
          await axios.get(
            `https://website-contacts.whoisxmlapi.com/api/v1?apiKey=${process.env.WEB_CONTACT_KEY}&domainName=${req.query.url}`
          ),
          await mql(req.query.url, {
            apiKey: '9hYBCgRn1P5WpCgIpmcRf7tk785f30P87piR5Ikc',
            function: healtcheckData.toString(),
            meta: false,
          }),
          await mql(req.query.url, {
            apiKey: '9hYBCgRn1P5WpCgIpmcRf7tk785f30P87piR5Ikc',
            meta: false,
            screenshot: true,
          }),
          await mql(req.query.url, {
            apiKey: '9hYBCgRn1P5WpCgIpmcRf7tk785f30P87piR5Ikc',
            meta: false,
            screenshot: true,
            fullpage: true,
          }),
          await mql(req.query.url, {
            apiKey: '9hYBCgRn1P5WpCgIpmcRf7tk785f30P87piR5Ikc',
            meta: false,
            insights: {
              lighthouse: false,
              technologies: true,
            },
          })
    ]);
    console.log(embed.value.data.html);
    
    console.log(socialllink.value.data.socialLinks);
    
    console.log(healthCheck.value.data);
    console.log("heyyyy");
    console.log(screenshot.value.data.screenshot);
    
    console.log("hiiiiiiii");
    console.log(fullscreenshot.value.data.screenshot);
    console.log("hello");
    console.log(technologyStack.value.data.insights.technologies);

  } catch (error) {
    console.log(error);
  }
};
