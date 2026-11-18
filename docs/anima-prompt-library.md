# 生图提示词素材库（Anima 适配）

> 来源：法典图鉴 novelai.quicktagcloud.com（构图风格 / 解构原典 / 千藤衣柜词条），2026-11-18 整理。

> 用途：打破「动作 + 场景同质化」。50 张精细绘图任务时从这里挑选，每个词条是一个独立创意。


## 使用前必读：NAI → Anima 语法适配

素材库保留词条原始 NAI 写法，直接粘进 Anima 工作流前需按站内 `src/lib/prompt-convert.ts` 规则转换：

- NAI 数字权重 `1.3::tag::` → Anima `(tag:1.3)`；`1.2::a, b::` → `(a:1.2), (b:1.2)`

- NAI `{tag}`（×1.05）在 Anima 里可忽略或写 `(tag:1.1)`；`[tag]` 同理弱化

- 角色/作品名的原生括号要转义：`(arknights)` → `\(arknights\)`，否则会被当权重括号解析

- 站内现成转换工具：`/tools` 页面（浏览器本地，Anima ⇄ NAI v4.5 ⇄ v5）

- 本工作流默认质量词：`safe, masterpiece, best quality, year 2025, newest, highres, detailed background`

- 负向固定含 `artist name, nsfw, nude, ... child, loli, shota`；标 `nsfw?` 的词条需按目标分级调整负向词与画师。

- 分级标注：`general` 默认安全；`nsfw?` 含轻微暴露/内衣/leotard。本库不含 r18g（重口）词条，用户明确不要。


## 一、场景 + 构图（64 条，打破场景同质化首选）

- **运河小船上的静谧时刻**
  ```text
  sitting in a small wooden boat on a calm canal, 1.3::medium shot, eye-level::, trailing her fingertips in the water with a dreamy, serene smile, wearing a pretty pink dress, 1.5::the cherry blossom trees on both banks form a spectacular pink tunnel overhead, covering the sky::, 1.4::the water surface is covered with floating petals and perfectly reflects the pink blossoms, creating an overwhelmingly romantic and magical atmosphere::
  ```
- **九份夜巷里的热汤回眸**
  ```text
  in a bustling, narrow old street with stone stairs at night, reminiscent of Jiufen, Taiwan, 1.2::medium shot, from a slightly high angle::, holding a bowl of hot taro ball soup with a happy and curious expression, wearing a simple dress and a jacket, 1.5::the entire scene is illuminated by the iconic warm, red glow from hundreds of traditional paper lanterns hanging overhead::, 1.2::the background is a dense crowd of people and traditional teahouses, creating a lively, festive, and nostalgic atmosphere::
  ```
- **新年市集里的糖果笑脸**
  ```text
  at a bustling chinese new year market on a historic street at sunset, 1.3::close-up on her face::, holding a small bag of traditional candies with a bright, excited smile, looking at the festive decorations, wearing a modern dress and a warm jacket, 1.5::the warm, golden light of the sunset mixes with the red glow from lanterns and decorations, creating a rich, saturated, and festive color palette::, 1.2::a dense crowd and piles of new year goods are blurred into a lively bokeh background::
  ```
- **台式夜市游戏摊前**
  ```text
  at a lively taiwanese night market, 1.2::cowboy shot, three-quarter view::, crouching in front of a brightly lit game stall, completely absorbed in playing with a look of focused excitement, wearing a casual dress and a jacket, 1.5::the scene is vibrantly illuminated by the colorful, harsh lights of the game stall itself, creating a fun and energetic atmosphere::, 1.2::the background is a blur of the night market crowd, food stalls, and other neon signs, slice of life, playful mood::
  ```
- **平溪铁轨旁写天灯**
  ```text
  on a railway track in a small town like Pingxi, Taiwan at sunset, 1.3::medium shot, eye-level::, carefully writing wishes on a large sky lantern with a brush, a sincere and hopeful smile on her face, wearing a dress and a jacket, 1.4::the soft, golden light of the setting sun bathes the scene, while in the background, a few lit sky lanterns are beginning to float into the twilight sky::, 1.2::a bustling crowd and old street shops are blurred in the background, magical, hopeful, transitional atmosphere::
  ```
- **便利店夏夜吃冰棒**
  ```text
  leaning against the glass door of a 24-hour convenience store on a humid summer night, 1.2::medium shot, eye-level::, eating a fruit popsicle with a content and relaxed expression, wearing a simple summer slip dress, 1.4::the bright interior light of the store creates a strong, beautiful rim light on her figure::, 1.2::the pavement outside is wet after rain, creating vibrant reflections, slice of life, quiet urban night atmosphere::
  ```
- **秋夜露天电影节回眸**
  ```text
  at an elegant outdoor film festival at night in autumn, 1.3::close-up on her face::, sitting in the audience and turning back with a gentle, dreamy smile, wearing a glamorous champagne-colored evening gown, 1.5::her face is softly illuminated by the cinematic light from the giant movie screen (off-screen), which reflects in her eyes::, 1.2::the visible beam of light from a projector cuts through the dark air behind her, romantic, magical atmosphere, bokeh background of other people::
  ```
- **云海新月上的钓星少女**
  ```text
  in a dreamy realm, 1.2::medium shot, eye-level::, sitting on a glowing crescent moon that floats on a sea of clouds, fishing for stars with a simple rod, a serene and curious expression, wearing a magical dress made of shifting flower petals, 1.5::the area below is a vast, rolling sea of soft clouds, with schools of small, glowing stars swimming within it::, 1.2::the sky is a soft pastel gradient of pink and purple, whimsical, magical, and peaceful atmosphere::
  ```
- **海边露台的月夜舞步**
  ```text
  dancing gracefully on a seaside terrace at night, 1.2::medium shot, from a slightly low angle::, one arm elegantly raised in a dance pose, an elegant and confident smile, wearing a beautiful off-the-shoulder white dress with a flowing sash, 1.4::the foreground is framed by white rose bushes::, 1.3::in the background, the sea is sparkling, with the brightly lit skyline of a distant city across the water, the sky is full of stars and a faint milky way::, magical, romantic, ethereal atmosphere, cinematic lighting
  ```
- **书店木架旁整理书册**
  ```text
  working as a clerk in a cozy bookstore, 1.3::close-up, from the side::, arranging books neatly on a wooden bookshelf with a gentle, kind smile, wearing a canvas apron over a long-sleeve dress, 1.5::warm afternoon sunlight slants through a large window, creating beautiful, visible light beams and highlighting floating dust particles::, 1.2::the background is filled with tall, blurry bookshelves, creating a scholarly and peaceful atmosphere, slice of life::
  ```
- **枫林里仰光微笑**
  ```text
  standing in a vibrant maple forest in autumn, 1.2::medium shot, eye-level::, tilting her face up towards the sun with her eyes closed and a pure, happy smile, wearing a light dress and an open beige jacket, 1.5::sunlight filters through the fiery red maple leaves overhead, casting a beautiful, warm, dappled light across her face and clothes::, 1.3::the air is filled with slowly falling red leaves, the ground is covered in a thick carpet of leaves, rich autumn colors, peaceful and heartwarming atmosphere::
  ```
- **花店工作台前修剪玫瑰**
  ```text
  working as a florist in a charming flower shop, 1.3::tight medium shot, eye-level::, standing behind a workbench and trimming a bouquet of roses with a focused, gentle smile, wearing a dark green waterproof apron over a dress, 1.4::the workbench is beautifully cluttered with various colorful flowers, leaves, and wrapping papers::, 1.2::bright, natural daylight floods the shop, the background is a blur of countless flowers in vases, creative and fragrant atmosphere::
  ```
- **黄昏大学天台眺望城市**
  ```text
  on a university rooftop at dusk, 1.2::medium shot, from the side::, leaning on the railing and looking out at the city with a calm, relaxed expression, wearing a beige cardigan, a white shirt, a pleated miniskirt, and black tights, 1.5::the low-angle golden hour sun creates a beautiful, warm rim light on her hair and silhouette::, 1.2::the background is a sprawling cityscape bathed in the warm glow of sunset, peaceful, academic, autumn atmosphere::
  ```
- **公寓阳台吹晚风**
  ```text
  on a modern apartment balcony at dusk, 1.3::close-up on her face and upper body::, leaning against the railing with her eyes closed, enjoying the evening breeze with a cozy, languid expression, wearing a white slip dress under a long, oversized beige cardigan, 1.4::the twinkling lights of the distant city create a beautiful, colorful bokeh background::, 1.2::a warm and intimate atmosphere, slice of life, peaceful end to the day::
  ```
- **秋林溪边俯身触水**
  ```text
  sitting on a mossy stone by a clear stream in an autumn forest at golden hour, 1.2::medium shot, from a high angle::, dipping her fingertips into the cool water with a quiet, thoughtful expression, wearing a long-sleeved dress, 1.5::many vibrant red maple leaves are floating on the water's surface, carried by the gentle current::, 1.3::golden sunlight filters through the autumn trees, creating sparkling reflections on the water, serene, poetic atmosphere::
  ```
- **夕阳河桥上的回眸**
  ```text
  leaning against the railing of a bridge over a river at sunset, 1.2::cowboy shot, three-quarter view::, looking back at the viewer with a gentle, bright smile, wearing a long-sleeved sailor school uniform, her school bag slung over her shoulder, 1.5::the sky is painted in brilliant orange and pink hues, which are perfectly reflected in the calm river below::, 1.2::city lights begin to twinkle in the distance, beautiful, nostalgic, after-school atmosphere::
  ```
- **冬日客厅沙发阅读**
  ```text
  curled up on a sofa inside a modern living room on a sunny winter day, 1.3::close-up on her face and the book::, reading a book with a focused and peaceful expression, wearing a cozy, oversized, chunky cable-knit sweater, 1.5::a patch of bright, warm winter sunlight streams through a large window, enveloping her in a golden glow::, 1.3::dust particles are visible dancing in the sunbeam, creating a tranquil and heartwarming atmosphere, clean and bright interior::
  ```
- **山间小站与复古红车**
  ```text
  standing on a quaint mountain railway platform in spring, 1.2::cowboy shot, eye-level::, holding down her skirt with a gentle, nostalgic smile as a vintage red train passes by, wearing a graceful white dress, 1.5::the passing train creates a spectacular blizzard of swirling cherry blossom petals that fills the air::, 1.3::the railway tracks are lined with blooming sakura trees, bright sunny day, beautiful, cinematic atmosphere::
  ```
- **明亮咖啡馆靠窗独坐**
  ```text
  sitting in a bright, minimalist cafe, 1.2::medium shot, from the side::, holding a cup of latte and gazing peacefully out the window, wearing a crisp, oversized white shirt, 1.5::a giant, magnificent cherry blossom tree in full, vibrant bloom is perfectly framed by the large floor-to-ceiling window::, 1.3::the clean glass has a faint reflection of the cafe's interior, serene, aesthetic, slice of life atmosphere::
  ```
- **夜樱灯下仰望**
  ```text
  strolling through a park at night during a sakura festival, 1.3::close-up on her face, from a low angle::, looking up at the illuminated blossoms with an expression of awe and wonder, wearing an elegant lavender dress, 1.5::the cherry blossom trees are lit from below by spotlights, making the petals glow with an ethereal, magical pink light::, 1.3::the unique uplighting casts soft, dramatic shadows on her face, yozakura (night sakura) atmosphere, beautiful, cinematic::
  ```
- **日式房间里的插花练习**
  ```text
  in a bright, minimalist Japanese-style room, 1.2::tight medium shot, eye-level::, kneeling on the floor, practicing ikebana with intense, serene concentration, carefully placing a single cherry blossom branch into a ceramic vase, wearing a simple white shirt with rolled-up sleeves, 1.4::the scene is filled with soft, diffused natural light coming from a large shoji screen in the background::, 1.2::zen atmosphere, peaceful, artistic, focus on the beauty of simplicity::
  ```
- **暴雨公交亭里的独处**
  ```text
  sitting alone in a bus shelter during a heavy summer thunderstorm, 1.2::medium shot, from within the shelter::, looking out at the rain with a calm and focused expression, her school bag beside her, wearing a short-sleeved school uniform, 1.5::a torrential downpour creates a curtain of rain just outside the shelter, blurring the street scene::, 1.3::reflections of streetlights and car headlights shimmer on the wet road, creating a strong contrast between the safe interior and the stormy exterior, atmospheric, cinematic::
  ```
- **雨天窗上画心**
  ```text
  in a bright, modern living room on a rainy day, 1.3::close-up on her face and hand::, drawing a heart on a foggy window pane with her finger, a gentle and playful smile on her face, wearing a comfortable linen house dress, 1.5::the window is covered in a beautiful layer of condensation, and the lines she draws are sharp and clear::, 1.2::the rainy, blurry view outside the window is visible through her drawing, cozy, heartwarming, quiet afternoon atmosphere::
  ```
- **雨后寺院撑伞漫步**
  ```text
  in a traditional temple courtyard right after a summer rain, 1.2::cowboy shot, from a slightly low angle::, holding an umbrella and walking carefully on the wet pavement, a serene and refreshed expression, wearing a summer school uniform, 1.5::the wet stone pavement is highly reflective, creating a perfect mirror image of the temple architecture and the clearing sky::, 1.3::water is dripping from the traditional eaves, the air is crisp and clean, beautiful, spiritual atmosphere::
  ```
- **老天文台前窥望星空**
  ```text
  at an old observatory at night, 1.3::close-up on her face and the telescope::, on tiptoes, looking through the eyepiece of a giant vintage brass telescope with an expression of awe and curiosity, wearing a khaki trench coat, 1.4::the observatory dome is open, revealing a spectacular starry sky with a clear milky way::, 1.2::the scene is dimly lit by starlight and faint work lights, creating a mysterious and scholarly atmosphere, cinematic lighting::
  ```
- **金色屋顶上的吉他**
  ```text
  on a city rooftop at golden hour, 1.2::medium shot, eye-level::, sitting on a chair with her eyes closed, immersed in playing an acoustic guitar, wearing an oversized beige hoodie, 1.5::the entire scene is bathed in the warm, saturated light of the setting sun, creating a beautiful, nostalgic atmosphere::, 1.2::the silhouette of the city skyline is visible in the background, along with a water tower and some potted plants, slice of life, indie musician vibe::
  ```
- **阳光画室里的成品审视**
  ```text
  in a bright, sun-drenched art studio, 1.2::cowboy shot, from behind and to the side::, leaning against a large window frame with her arms crossed, appraising a freshly finished painting on an easel with a focused expression, wearing an oversized white shirt splattered with paint, 1.4::the room is filled with bright, natural light, illuminating the textures of the canvas and the colors on a nearby palette::, 1.2::art supplies, brushes, and other paintings are scattered around, creating a creative and authentic atmosphere::
  ```
- **时间静止房间里的惊奇**
  ```text
  in a room where time is frozen, 1.3::close-up on her face and hand::, reaching out cautiously to touch a sugar cube that is suspended in mid-air, an expression of utter surprise and awe, wearing an elegant afternoon tea dress, 1.5::a stream of tea pouring from a teapot is also frozen mid-air, forming a static arc of liquid, dust particles and even a bird outside the window are motionless::, 1.2::sunlight beams are solidified in the air, creating a surreal, magical, and eerie atmosphere, cinematic lighting::
  ```
- **清晨花市挑选盆栽**
  ```text
  at a bustling city flower market in the early morning, 1.3::close-up on her face and hands::, carefully examining a small potted plant with a focused and gentle smile, wearing a simple dress and a light denim jacket, 1.5::the foreground and background are filled with a vibrant bokeh of countless colorful flowers and plants, creating a beautiful natural frame::, 1.2::the soft morning light makes the scene bright and fresh, heartwarming, slice of life atmosphere::
  ```
- **春日草坪吹蒲公英**
  ```text
  sitting on a lush green campus lawn on a sunny spring afternoon, 1.4::extreme close-up on her face and the dandelion::, holding a detailed dandelion puff close to her lips, about to blow the seeds with a hopeful and playful expression, wearing a summer school uniform, 1.5::the delicate, translucent seeds of the dandelion are in sharp focus::, 1.2::the background is a beautiful bokeh of the green grass and a grand library building, youthful, nostalgic, slice of life atmosphere::
  ```
- **雨后山径与指尖蝴蝶**
  ```text
  on a mountain trail after a spring rain, 1.3::close-up, focusing on her hand and the butterfly::, a beautiful, detailed butterfly is resting on her outstretched index finger, her face is in profile in the background with an expression of gentle surprise, wearing a functional windbreaker, 1.5::the butterfly's intricate wing patterns are in sharp focus::, 1.3::glistening raindrops hang on the vibrant green leaves all around, creating a fresh, serene, and magical atmosphere of connection with nature::
  ```
- **黄昏屋顶花园浇花**
  ```text
  watering plants in a rooftop garden at dusk, 1.2::medium shot, from a low angle::, holding a watering can with a content and loving smile, wearing a comfortable house dress, 1.5::the golden hour sunset light filters through the water droplets from the can, making them sparkle like gold::, 1.3::the background is a vast, beautiful sky painted in pink and purple hues, with the city skyline as a distant silhouette, peaceful, nurturing, urban farming atmosphere::
  ```
- **雷雨后捷运站台小憩**
  ```text
  leaning against a pillar on an open-air MRT station platform after a summer thunderstorm, 1.2::medium shot, eye-level::, fanning herself with a book, a calm and slightly languid expression, wearing a summer school uniform, 1.4::the platform is wet and reflective, mirroring the clearing sky and station lights, creating a humid and steamy atmosphere::, 1.2::modern architecture of the station, blurry city view in the background, slice of life, tranquil urban moment::
  ```
- **台式夜市里的珍珠奶茶回眸**
  ```text
  in a bustling taiwanese night market, 1.3::close-up on her face::, looking back over her shoulder with a bright, happy smile while holding a cup of bubble tea, wearing a simple summer dress, 1.5::the background is a vibrant, colorful bokeh of countless night market stalls, signs, and lights, creating a lively atmosphere::, 1.2::condensation droplets are visible on the cold drink cup, energetic, slice of life, foodie moment::
  ```
- **日落海边咖啡馆发呆**
  ```text
  sitting at a rustic beachside cafe at sunset, 1.2::medium shot, from the side::, resting her chin on her hand and gazing at the ocean with a serene, relaxed expression, wearing a semi-transparent white cover-up over her swimsuit, 1.5::a brilliant sunset is happening over the ocean, painting the sky in vibrant orange and purple hues::, 1.3::the sea breeze is gently blowing her slightly wet hair and the fabric of her cover-up, tranquil, tropical, beautiful atmosphere::
  ```
- **盛夏老街折扇遮阳**
  ```text
  walking on a historic old street on a hot summer day, 1.3::close-up on her face, framed by the fan::, shielding her face from the sun with a beautiful, open folding fan, looking out with curious eyes, wearing a modern, elegant qipao-style dress, 1.4::the intricate design of the traditional fan is in sharp focus::, 1.2::harsh, bright sunlight creates strong shadows on the red brick walls in the background, cultural, hot, slice of life atmosphere::
  ```
- **秋日山路徒步回望**
  ```text
  on a mountain trail in autumn at golden hour, 1.2::cowboy shot, three-quarter view::, pausing her hike to look back with a bright, happy smile, wearing a lightweight windbreaker jacket, 1.5::surrounded by a vast, beautiful sea of silvergrass (pampas grass) that is glowing golden in the sunset and waving in the breeze::, 1.2::the background is a silhouette of distant mountains against a warm, colorful sky, energetic, breathtaking nature, Taiwanese autumn atmosphere::
  ```
- **秋日校园咖啡馆沉思**
  ```text
  sitting by the window in a cozy campus cafe in autumn, 1.3::close-up on her face and upper body::, resting her chin on her hand with a calm, thoughtful expression, a cup of latte beside her, wearing a soft beige knit sweater, 1.4::soft afternoon sunlight streams through the window, creating a warm and gentle light on her face::, 1.2::through the window, the leaves of the trees have turned yellow and brown, creating a beautiful autumn view, peaceful, studious atmosphere::
  ```
- **台北河滨骑行**
  ```text
  riding a bicycle in a riverside park in Taipei at dusk, 1.2::cowboy shot, from the side, panning shot::, looking towards the river with a content and relaxed smile, wearing an oversized hoodie, 1.4::the sky is a beautiful twilight gradient of deep blue and orange, and the city lights from the opposite bank are reflecting on the water surface::, 1.2::the iconic Taipei 101 is visible in the distant skyline, cool autumn breeze, peaceful, urban sports atmosphere::
  ```
- **塞纳河旧书摊选书**
  ```text
  browsing a traditional bouquiniste bookstall along the Seine river in Paris on a winter day, 1.2::tight medium shot, eye-level::, intently reading an old book she picked up, a focused and curious expression, wearing a stylish wool overcoat and a beret, 1.4::light snow is gently falling, dusting her shoulders and the iconic green book box::, 1.2::the background is a blurry view of a stone bridge and Parisian architecture, creating a romantic, intellectual, and timeless atmosphere::
  ```
- **中央公园暮色滑冰**
  ```text
  ice skating at the Wollman Rink in Central Park at dusk, 1.2::cowboy shot, dynamic angle::, captured in a graceful spinning motion with a joyful, radiant smile, her cheeks flushed, wearing a white turtleneck sweater, a plaid skirt, and a red scarf, 1.4::the iconic New York City skyline is lit up in the background, visible through the bare winter trees::, 1.2::the background is a beautiful bokeh of other skaters and festive lights, creating an energetic, magical, and iconic winter atmosphere::
  ```
- **祇园祭宵山人群回眸**
  ```text
  during the Yoiyama evening of the Gion Matsuri festival in Kyoto, 1.2::close-up, eye-level::, looking back over her shoulder with a bright, excited smile in a dense crowd, wearing a traditional yukata, holding a small fan, 1.5::the scene is warmly illuminated by thousands of traditional paper lanterns hanging from festival floats and historic machiya townhouses::, 1.2::the background is a beautiful bokeh of other people in yukatas, creating a vibrant, energetic, and culturally rich atmosphere::
  ```
- **平溪天灯节放灯后仰望**
  ```text
  at the Pingxi Sky Lantern Festival in Taiwan at night, 1.2::medium shot, from a low angle::, looking up with a bright, hopeful smile after releasing a sky lantern, wearing a casual jacket, 1.5::the sky is filled with hundreds of glowing orange sky lanterns rising like a river of stars, creating a breathtaking and magical atmosphere::, 1.2::the railway tracks are crowded with people, and the old street shops are lit up in the background, festive, spiritual, and heartwarming::
  ```
- **中秋苏州园林提灯**
  ```text
  in a classical Suzhou garden on Mid-Autumn Festival night, 1.2::cowboy shot, from the side::, holding a glowing rabbit-shaped lantern and resting a hand on a stone bridge railing, a gentle and serene expression, wearing an elegant Hanfu, 1.5::a bright full moon and its perfect reflection are visible on the calm lake surface::, 1.2::the scene is beautifully lit by the silver moonlight and the warm glow from her lantern, creating a poetic, tranquil, and timeless Chinese atmosphere::
  ```
- **沙发上亲密共享耳机**
  ```text
  2girls, sitting close together on a sofa, 1.3::close-up on their faces::, afternoon sunlight from a window, warm and soft atmosphere, tangled earphone cable, shallow depth of field, cozy living room background, intimate, heartwarming moment, 角色1: gently putting one of her earbuds into the other girl's ear, a gentle, smiling expression with eyes closed, 角色2: looking slightly surprised, blushing, wide-eyed, slightly parted lips
  ```
- **夜市饰品摊前的双人挑选**
  ```text
  2girls, at a lively night market stall, 1.2::medium shot, eye-level::, 1.5::vibrantly illuminated by the bright lights of the accessory stall::, colorful bokeh of the bustling night market crowd and other stalls, energetic, cute, playful interaction, 角色1: playfully putting a cute hairclip on the other girl's head, smiling fondly, teasing expression, 角色2: looking at her reflection in a small mirror, surprised and blushing expression, holding a small mirror
  ```
- **明亮厨房里的双人蛋糕课**
  ```text
  2girls, making a cake together in a bright kitchen, 1.3::tight medium shot, focusing on their hands and faces::, both wearing aprons, 1.4::bright natural light floods the kitchen, the table is filled with baking ingredients and tools::, sweet, domestic, collaborative atmosphere, heartwarming, 角色1: stands behind the other girl, gently guiding her hands to use a piping bag, a gentle, patient smile, 角色2: focused but blushing from the closeness, looking down at the cake, slightly clumsy
  ```
- **淡水码头日落背影**
  ```text
  2girls, at the seaside at sunset, Tamsui Fisherman's Wharf, 1.2::medium shot, from behind::, looking at the beautiful sunset over the ocean, romantic, peaceful atmosphere, silhouettes against the sky, 角色1: arm around the other girl's shoulder, head tilted slightly towards her, content expression, 角色2: leaning her head on the other girl's shoulder, relaxed and safe expression, holding hands with her
  ```
- **阳明山海芋田捧花**
  ```text
  1girl, standing in a calla lily field at Yangmingshan, Taiwan, 1.2::cowboy shot, eye-level::, holding a freshly picked bouquet of white calla lilies with a happy, satisfied smile, wearing waders or rain boots, 1.5::surrounded by a vast, beautiful sea of pure white calla lilies under a bright spring sun::, 1.2::the background is a blurry view of green mountains and a hint of mist, creating a fresh and serene atmosphere, slice of life::
  ```
- **山间茶屋品春茶**
  ```text
  1girl, sitting at a wooden table at an outdoor tea house in the mountains, 1.3::close-up on her face and the teacup::, savoring the aroma of fresh spring tea with a serene, intoxicated expression, her eyes are closed, wearing a simple white shirt, 1.5::the background is a magnificent, blurry view of vast, terraced green tea fields under a clear sky::, 1.2::a traditional tea set is on the table, peaceful, refined, zen atmosphere::
  ```
- **红砖老巷里仰望繁花**
  ```text
  1girl, standing in a quiet, historic red-brick alley in southern Taiwan, 1.2::medium shot, from a low angle::, looking up with a gentle, amazed expression at the flowers above, wearing a simple white dress, 1.5::a massive, spectacular cascade of vibrant pink bougainvillea tumbles over the top of an old wall, creating a stunning floral waterfall::, 1.3::dappled sunlight creates intricate patterns of light and shadow on the brick wall, beautiful, slice of life, cultural atmosphere::
  ```
- **春日草坪上的耳机午后**
  ```text
  1girl, lying on a lush green lawn in a park on a spring day, 1.4::extreme close-up on her face, from a high angle::, listening to music with headphones, a blissful and completely relaxed smile on her face with eyes closed, her head is resting on her arms, 1.5::soft spring sunlight warms her face, a few cherry blossom petals have fallen on her hair::, 1.2::the background is a beautiful, soft bokeh of green grass and sunlight, peaceful, serene, ultimate relaxation::
  ```
- **盛夏缘侧纳凉**
  ```text
  sitting on the polished wooden veranda (engawa) of a traditional Japanese house on a hot summer afternoon, 1.2::medium shot, from a slightly low angle::, gently fanning herself with a round fan (uchiwa) and looking up at a wind chime with a calm, comfortable expression, wearing a light cotton yukata, 1.4::a beautiful, translucent glass wind chime (furin) is tinkling in the foreground breeze::, 1.2::the background is a lush green Japanese garden with strong, dark tree shadows cast by the intense sunlight, creating a tranquil, nostalgic atmosphere::
  ```
- **澎湖海岸公路骑车回眸**
  ```text
  riding a scooter along a beautiful coastal road in Penghu, Taiwan on a sunny summer day, 1.2::cowboy shot, dynamic angle::, turning back with a joyful, carefree laugh, wearing a simple t-shirt and denim shorts, 1.5::her long hair is blowing dramatically in the strong sea breeze::, 1.3::the background is a stunning view of a turquoise blue ocean and unique basalt column cliffs, creating an adventurous, energetic, and free atmosphere::
  ```
- **西湖石桥油纸伞清晨**
  ```text
  standing on a traditional arched stone bridge at West Lake in Hangzhou in the early morning, 1.2::medium shot, eye-level::, holding a beautiful oil-paper umbrella and looking out at the view with a serene expression, wearing an elegant qipao-style dress, 1.5::surrounded by a vast, magnificent field of giant green lotus leaves and blooming pink lotus flowers::, 1.3::a thin layer of morning mist hangs over the water, creating a poetic, timeless, and classically Chinese atmosphere::
  ```
- **日本乡间夏夜萤火**
  ```text
  on a summer night in the Japanese countryside, 1.3::close-up on her face and hand::, looking with pure wonder and a gentle smile at a single firefly glowing on her outstretched fingertip, wearing a yukata, 1.5::the entire scene is magically illuminated by thousands of other flying fireflies, creating beautiful, glowing light trails and a spectacular bokeh effect::, 1.2::the background is a dark forest by a small stream, creating an enchanting, peaceful, and deeply magical atmosphere::
  ```
- **秋日岚山竹林沉思**
  ```text
  in the Arashiyama Bamboo Grove in Kyoto during autumn, 1.2::medium shot, eye-level::, leaning against a thick bamboo stalk with a serene, contemplative expression, wearing an elegant traditional kimono, 1.5::beautiful, volumetric sunbeams are filtering through the tall bamboo stalks::, 1.3::a few vibrant red maple leaves are scattered on the green mossy ground, creating a strong color contrast, peaceful, aesthetic, and classically Japanese atmosphere::
  ```
- **北京银杏大道拍胶片**
  ```text
  on a ginkgo-lined avenue in Beijing in autumn, 1.2::cowboy shot, three-quarter view::, raising a vintage film camera to take a picture with a happy, focused expression, wearing a classic khaki trench coat, 1.5::a beautiful, dense shower of golden ginkgo leaves is falling all around her::, 1.3::the ground is completely covered in a thick, golden carpet of leaves, creating a vibrant and spectacular autumn scene, bright sunny day::
  ```
- **山间木屋夜里捧热饮**
  ```text
  inside a cozy wooden cabin at a mountain resort in Taiwan at night, 1.3::medium shot, eye-level::, curled up in a soft armchair wrapped in a wool blanket, cupping a warm mug with a comfortable expression, wearing a chunky turtleneck sweater, 1.5::the crackling fireplace is the only main light source, casting a warm, flickering glow on the entire scene::, 1.2::through the large window beside her, the moonlit, colorful autumn forest is visible, creating a strong contrast between the cold outside and the warmth inside, extremely cozy atmosphere::
  ```
- **奈良公园喂小鹿**
  ```text
  crouching down in Nara Park, Japan during autumn, 1.2::medium shot, from a low angle::, carefully offering a deer cracker (shika senbei) to a small, bowing deer, a gentle and happy smile on her face, wearing a dress and a cardigan, 1.4::the ground is covered in a beautiful carpet of red and yellow fallen leaves::, 1.2::other deer and the eaves of a traditional temple are visible in the blurry background, heartwarming, interactive moment with nature, slice of life::
  ```
- **札幌雪祭仰望雪雕**
  ```text
  at the Sapporo Snow Festival in Japan at night, 1.2::medium shot, from a low angle::, looking up at a massive, detailed snow sculpture with an expression of pure awe and wonder, wearing a thick down jacket, a knit hat, and a scarf, 1.5::a spectacular, color-changing projection mapping light show is illuminating the snow sculpture, casting vibrant hues on her and the surroundings::, 1.3::her warm breath is clearly visible in the freezing air, light snow is falling, creating a magical and festive winter atmosphere::
  ```
- **乌来冬夜露天温泉**
  ```text
  soaking in a private, stone-lined outdoor hot spring (rotenburo) in Wulai, Taiwan on a winter night, 1.3::close-up on her face and shoulders::, her eyes are closed with an utterly relaxed and comfortable expression, 1.5::a large amount of thick, white steam is rising from the water, creating a dreamy and hazy atmosphere that obscures her body::, 1.2::the background is a blurry Japanese-style garden with bamboo and a stone lantern covered in frost, serene, healing, peaceful moment::
  ```
- **雪后胡同里的糖葫芦**
  ```text
  walking in a traditional Beijing hutong after a heavy snow, 1.3::close-up on her face and the tanghulu::, taking a bite of a bright red tanghulu with a happy and satisfied expression, wearing a thick padded jacket and a scarf, 1.5::the vibrant red, crystal-coated candied fruit creates a strong contrast with the white snow scene::, 1.2::the gray brick walls and tiled roofs of the hutong houses are covered in a thick blanket of snow, creating a nostalgic, slice-of-life atmosphere::
  ```
- **白川乡雪夜观景台**
  ```text
  standing on the observation deck overlooking Shirakawa-go village in Japan on a winter evening, 1.2::medium shot, from behind and to the side::, gazing at the view with a captivated and moved expression, wearing a long, thick overcoat and a scarf, 1.5::below, the entire village of Gassho-zukuri farmhouses is covered in deep snow, with warm, golden light glowing from their windows, creating a fairytale-like scenery::, 1.2::the sky is a deep twilight blue and snow is gently falling, magical, picturesque, and peaceful atmosphere::
  ```

## 二、动作 + 姿势（274 条，打破动作同质化）

- **单手倒立**
  ```text
  1girl, 1girl, {one arm handstand}, outdoors, upside-down,armpits, asymmetrical legwear, black footwear, black jacket, black shorts, black socks, black thighhighs, blue sky, boots, breasts, pink hair, ribbon, short shorts, shorts, sky, smile, socks, solo
  ```
- **角色还原法**
  ```text
  {{texas the omertosa (arknights)}}1girl,solo white background,dymanic pose, cute,smile,floating,floating hair,hand on own chest
  ```
- **情绪流**
  ```text
  {{texas the omertosa (arknights)}}1girl,white background,White,sitting, grass, from side,head down,sad,solo
  ```
- **安吉尔铁拳**
  ```text
  1boy, 1girl, {{{ambriel (arknights))}}}, alternate costume, {armor},gauntlets ,pauldrons ,thighhighs,excited,{{punching viewer}},motion lines ,action
  ```
- **直至没有纷争的未来**
  ```text
  flying_kick ,symmetrical clothing, fighting pose, spreading legs, legs up,from below, kicking,midnight city,1girl,A tight muted color dress,taut_dress,bloomers
  ```
- **坠落法**
  ```text
  {kal'tsit (arknights)(arknights)}1girl,solo,cat ears,white background,falling down,floating,in air,floating hair,Bubbles, refracted sunlight, light spots, sadness, lowered head,short hair
  ```
- **冰剑兽**
  ```text
  (arknights),{The scar on the eye},ultra-detailed face,{{numen}},{huge monster},{no humans},{{close up}}{fighting stance},{armored dress},steam,{Armored gloves},{armour},{{glowing translucent ice sword}},{closed up},{glowing eyes},Upper armlet,evil smile,cowboy shot,Ferocious eyes,illustration, beautiful detailed, finely detailed, dramatic light, intricate details, perfect anatomy
  ```
- **镭射泥岩**
  ```text
  1girl,{mudrock (arknights)},demon horns, white background, white hair,red eyes,bare shoulder,{{{holographic hair,iridescent,reflective clothes,holographic clothing}}},jacket,reflection,upper body
  ```
- **愚痴り合い**
  ```text
  {2girl},1girl upside-down,circle,lying,floating hair, back-to-back,multiple girls
  ```
- **库丘林**
  ```text
  cu chulainn (fate) ,1boy, armor, black background,blue bodysuit, bodysuit, foreshortening, from side, furrowed brow, gae bolg (fate), holding, holding polearm, holding weapon, long hair, looking at viewer, male focus, parted lips, polearm, red eyes, shattered, shoulder armor, solo, spear, weapon
  ```
- **晚礼服凯猫猫**
  ```text
  kal'tsit (arknights)1girl,figure, amazing beauty, indoor,black dress, holding flowers, light and shadow, depth of field, light spot, reflection,upper body,nigth,street
  ```
- **倒立吃面**
  ```text
  {1girl ,{upside-down} , {ho'olheyak (arknights)}, 1girl,eatting noodle,holding chopsticks, head wings, alternate costume, aqua eyes,large breasts, pectoral apron, black choker, black dress, white hair, rolling up the hem of tights, black pantyhose, looking at viewer ,{indoors background},shirt , smile ,solo ,white shirt
  ```
- **礼服之夜前**
  ```text
  kal'tsit (arknights)1girl,figure, amazing beauty, indoor,from back,bare back, tied hair,Mirror, self reflected in the mirror, stool, sitting on the stool, table, mirror on the table, light and shadow, depth of field,light spot, reflection
  ```
- **霸王龙机娘**
  ```text
  {{1girl}},eyes,cyborg,{Medium Breast},joints,looking at viewer,Medium mechanical arms,{huge Mechanical claw},mechanical hands,mechanical legs,Mechanical tail,Hydraulic rod,mechanical spine,mechanical parts,official alternate costume,robot joints,science fiction,Mechanical Horn,skin tight,{mask},solo,barcode,robot,suspension,tube,{running},Simple background
  ```
- **无处不在杰尼龟**
  ```text
  reed (arknights), 1girl, solo,green eyes,track jacket, shorts,large breasts, squirtle on head
  ```
- **奥特曼怪兽**
  ```text
  ultraman monster, bodysuit, claws, closed mouth, fighting, horns, kaijuu, mask, open mouth, sharp teeth, simple background, single horn, tail, teeth, tokusatsu, white background
  ```
- **折射**
  ```text
  1girl,{mudrock (arknights)},demon horns, white background, white hair,red eyes,bare shoulder,{{{holographic hair,iridescent,reflective clothes,holographic clothing}}},jacket,reflection,upside-down,spread legs,lingerie, {reflection}
  ```
- **404**
  ```text
  {2girls , {ump45 (girls' frontline) and ump9 (girls' frontline) holding a banner with "404" written on it}, apron
  ```
- **侠女**
  ```text
  muelsyse (arknights),1girl, solo,hanfu,chinese clothes,splatter background, holding sword
  ```
- **水晶体改造**
  ```text
  {{{translucent body}}}}, 1girl,{{mask}},aqua eyes,cyborg,Medium Breast,grey hair,joints,looking at viewer,mechanical arms,mechanical hands,mechanical legs,Hydraulic rod,mechanical spine,mechanical parts,medium hair,official alternate costume,robot joints,science fiction,skin tight,solo,translucent skin,barcode,quadruple amputee,robot, sparks,suspension,tube,wire,{cross section},{Gnaku},standing,Simple background
  ```
- **召唤火焰！**
  ```text
  1 girl,{{Floating Fire Magic Spell and a burst of flam}},book,looking at viewer,close-up, cowboy shot,cinematic lighting, volume lighting, light particlestachie,dynamic angle ,ray tracing
  ```
- **蛛网的俘虏2.0** `nsfw?`
  ```text
  {{from below}}, {{{huge spider web}}}, {1 loli caught in a spider web}, {bind}, {full body}, {{floating loli}}, red dress, {tears}, {fear}, {Crazy angle}, grey eyes, {cute face}, solo {{gravity-free}}, {{winding}}, Dead tree, Dark clouds, {an and beautiful}, ultra-detailed
  ```
- **雷电将军与神子**
  ```text
  [art:genshin impact], {{{{2 girls}}}}, Raiden Shogun(genshin impact) and Yae Miko(genshin impact), {upper body}, {{back to back}}, {{cool}}, grim expression, dynamic Angle Japanese shrine with floating sakura background, {an and beautiful}, ultra-detailed
  ```
- **夜雨**
  ```text
  kal'tsit (arknights),,blurry, blurry foreground,by rella,Dark environment, from above, full body,1girl,solo,curl up in bed, arms around her knees, in room, one of Her arm covered her eyes,very sad,she has long and smooth eyelashes,sad crying, tears drop from her face, wet clothes, White nightdress, rainning outside,overcast sky,neon lights, lights, cyberpunk, windows, reflections, reflections,Neon lights outside the window, raindrops hitting the window at night
  ```
- **床上的哥特萝莉** `nsfw?`
  ```text
  8K,wallpaper,colorful,ultra-detailed,dreamcore,realistic,commercial light and shadow,film light and shadow,{{detailed eyes}},oil-painting {1girl},loli,blonde hair,long hair,gothic lolita,in room,on side,head rest,on bed,looking at viewer, evil smile,shaded face, one eyes closed,{{black lace-trimmed panties}},{{from below}}
  ```
- **冬与咖啡**
  ```text
  amiya(arknights), 1girl,figure, amazing beauty, {detailed background},aestheticism, sitting, winter, coffee shop, corner, coat, scarf, large breasts, gray hair, red eyes, emotionless, obedient, obedient, thick eyebrows, small nose, full lips, long eyelashes, delicate neck, slender shoulders, bare arms, delicate hands, long fingers, pointed nails, high cheekbones, oval face, smooth skin, rosy cheeks, cup of coffee, saucer, steam, warm, cozy, comfortable, relaxed, calm, quiet, peaceful, serene, contemplative, close-up
  ```
- **黑岩**
  ```text
  {{black rock shooter}}, umetric light and shadow, light particles, blurry, light rays, shadow, {cinematic lighting}, from below, {backlighting}, 1girl, blue fire eyes, glowing eyes, solo, portrait, upper body, blood in eyes, cold expression, {{{{{point a pistol at viewer}}}}}}, {{{{{{{cracked screen}}}}}}}, broken face, {{{floating broken glass}}}
  ```
- **鬼丸国纲**
  ```text
  {{1girl}},super detail,ultra detail,{{linea art}},commercial light and shadow,film light and shadow,weapon,{{detailed eyes}},1girl,{holding a katana},{fighting stance},{ firing at viewer},{long-print kimono},{{bare shoulder}},{woven gold,embroidery},{{white hair}},{{hime cut,very long hair},{{perfect body}},expressionless,{{kimono}},white hair,looking at viewer,{close-up},autumn,{{akatsuki leaf}},movie_tonal,cinematic shot,blowing wind,dynamic hair,dynamic_perspective,dynamic_angle_focus,pose_variation,cinematic_lighting
  ```
- **画中人**
  ```text
  {blue and grey streaked hair}, {choker}, {collarbone visible}, {hand holding picture frame}, {expressionless look at viewer},flower accents, {holding empty photo frame}, {portrait with photo frame},ribbon choker,{simple background}, solo, {straight-on view}, upper body, {white background}, subtle light on hand and frame,high resolution
  ```
- **儿时的落叶**
  ```text
  1 girl, {{{{ suzuran (arknights) }}}, yellow hair, yellow eyes, blue hair band, fox ears,{{{bath yukata)}}}, (autumn, floating leaves), 1girl, crooked head, solo, looking at viewer, {{{half -open eyes}}}, {{ light smile, blush}}, {{Holding a piece of fallen leaf in one hand}}
  ```
- **芙芙牌巧克力牛奶** `nsfw?`
  ```text
  {{furina_(genshin_impact)}}{eterochromia}}},halloes,smile,{footjob with bottle box milk},{knees_up},spread legs,underwear,from below,looking at viewer,black pantyhose,torn pantyhose,white background
  ```
- **草莓吐司**
  ```text
  looking_at_viewer,{on one knee},light red eyes,1 girl,solo,long white hair,{black antlers},bang,toast,deer tail,hair_between_eyes,black shirt,transparent sleeves,transparent jacket,bare shoulders,neck ribbon,showing shoulder,[black air jordan 1],{long hair},toast,black pantyhose,ahoge, happy,pose,arknights
  ```
- **大蛇丸**
  ```text
  ruto,naruto(series),1boy,upper_body,1boy,black_hair,chokutou,holding,holding_sword,holding_weapon,japanese_clothes,male_focus,open_clothes,open_shirt,red_eyes,sharingan,shirt,snake,solo,sword,weapon,white_background,white_shirt,white_snake,volumetric light and shadow, light particles,blurry,light rays,shadow,{cinematic lighting},{backlighting}
  ```
- **香菱&胡桃**
  ```text
  2girls, Hu tao (Genshin Impact),Xiangling(Genshin Impact) ,symmetrical composition
  ```
- **真・女神転生**
  ```text
  lineart,flat_color, limited color, 1 girl,messy_hair, fetal position, looking at viewer, black and red tone,biomechanical tattoo,full body,simple background, beautifully detailed background,geometric,cables connected to body
  ```
- **秋叶随风，笑靥如花**
  ```text
  1 girl, {{{hatsune miku}}}, green hair, twintails, long hair,{{{school uniform)}}}, (autumn, floating leaves), 1girl, crooked head, solo, looking at viewer, {{ open mouth,closed eyes, smile,blush}},spread arms, lying on plenty of leaves,incoming hug, {CG unity ultra-detailed,depth of field},{best illumination, best shadow, an extremely delicate and beautiful}, cowbot shot, from above
  ```
- **平地摔！？但是赛马娘**
  ```text
  !?, 1girl, daiwa_scarlet_(umamusume), > <,{1 girl is losing her balance and falling down}, unbalance, dutch angle, motion lines, {slipping,fallen_down, banana_peel}, hands up, one leg up, animal ears, black footwear, breasts,speed line, wallpaper,colorful,ultra-detailed,dreamcore,realistic,commercial light and shadow,film light and shadow
  ```
- **愚者之行**
  ```text
  Tarot card border, beautiful frame, from side, {1 girl} carrying a cloth bag walking on the road, looking up, giggling, beggar clothes, head scarf, {braided bun}, text:Fools, a dog walking at the feet, beautiful dog
  ```
- **龙门的雨**
  ```text
  kal'tsit (arknights),blurry, blurry foreground,dark environment\\uff0c Rainwater on clothes, raindrops falling on the body,from side,1girl,{{black raincoat}},outside,upper body,solo,Streets, streetlights, neon lights, reflected lights, plastic umbrellas, light reflected from umbrellas,wet clothes,rainning outside,overcast sky,neon lights, lights, cyberpunk, windows, reflections, reflections,Neon lights outside the window, raindrops hitting the window at night
  ```
- **握剑**
  ```text
  super detail,ultra detail,heroic,1girl,black school uniform, hime_cut,black long hair, black eye,,hold sword,dyname pose,hyperrealistic,black background,monochrome,{{{chiaroscuro}}}
  ```
- **学医救不了蒙德**
  ```text
  barbara_(genshin impact),{{1girl}}, solo, ,fist,pose,emphasis_lines,raised fist,hara tetsuo,{fist},incoming punch, shaded face, fighting stance,motion lines, serious
  ```
- **夜晚**
  ```text
  super detail,ultra detail,1girl,sleepy, sleepyUsing phone in bed, phone light illuminates face,chiaroscuro,Realistic,cool color, {{{lonely}}}, night,dark room
  ```
- **夜色朦胧，她在等谁**
  ```text
  1girl,solo, {{half closed eyes}}, medium breasts, heavy breath, winter, steam, shy, {blush}, black hairs, long hairs, red scarf, black winter coat, sitting on chair, arms at side, outdoors, merry christmas , christmas, christmas bazaar, evening, street light, from side, upper body, looking down, blow, wind, blurry background,bokeh,,convenient censoring
  ```
- **雪女法**
  ```text
  year_2022,illustration,1_girl,solo,from_outside,Light and dark division,night,fog,pale_skin,large breasts,white_hair,long_hair,ice_eyes,bright_pupils,eyelashes,kimono,chest engine,covered with ice and snow,beckon,heavy_breathing,seductive_smile,open the door,highest detail
  ```
- **Error_Error_Error ①**
  ```text
  [[The background features a Weird Core style]],weird core art,{{{glitch art}}},{pixel art},horrifying,{{mosaic}},Internet Aesthetics,Aberrant Art,Surreal
  ```
- **神里-长枪**
  ```text
  {kamisato ayaka},finger to viewer, holding spear, white hair, Wedding Dress, white gloves,anime
  ```
- **姐姐和弟弟**
  ```text
  fate/stay night,fate (series),emiya shirou,illyasviel von einzbern,1boy,1girl,close-up,closed eyes,heart,hug,limited palette,long hair,long sleeves,looking at another,one eye closed,open mouth,simple background,sketch,smile,white background,white hair
  ```
- **以此烈火斩无不断**
  ```text
  kiana kaslana (herrscher of flamescion),CG unity ultra-detailed,illustration,Dynamic angle,red and orange theme,1girl,great sword,Flame particle
  ```
- **独行于暗巷之中** `nsfw?`
  ```text
  cowboy_shot,one girl,solo,Steampunk,{{{loli}}},delicate,silver_hair,medium hair,Wear goggles on head,cat ear,red pupil,{{maid}},Black trench coat,bare shoulder dress,white gloves,black tights,Leg holster,courtyard,{{sniper rifle}},steam style, {{heavy rain}},night
  ```
- **午夜芭蕾**
  ```text
  1girl,solo,{realistic},full body,ballet,ballet dress,dark background,reflection
  ```
- **琪亚娜的美梦**
  ```text
  commercial light and shadow,8K, realistic,1woman,medium breasts,{{{{{{kiana kaslana}}}}}},two long braids,white hair},closed eyes,looking at viewer,{{closed eyes}},mouth drool,in bed,pillow hug,polka_dot_pajamas,sleeping,:3,from above
  ```
- **侠影**
  ```text
  {Chinese martial arts style},{1boy}, male focus, monochrome, weapon, long hair, greyscale, scarf, bandages, black hair, Holding a spear, topless,hair over one eye,Dragon-shaped pauldrons,bloody sunset, Showdown under the plum tree
  ```
- **火之将熄**
  ```text
  [reverse:1999],commercial light and shadow,sidelight,oil-painting,1girl,steampunk,{{victorian blazer}},{small top hat},{single black eyepatch},{rapier in hand},steampunk girl,shiny hair,{white hair},expressionless,cowboy shot,{{{one hand adjusting top hat}}},slanted eyes,on side,{from below },{on side},{looking at viewer},{outroom},sunset,magnificent_architecture,{close-up},[selfie],{{wind lift}}
  ```
- **焰火**
  ```text
  super detail,ultra detail,1girl,T-shirt,office lady,evening, solo,in office, working, use computer,chiaroscuro,Realistic, fireworks outside the window,Spring Festival,sad,tired,Spring couplets,l,,desk lamp
  ```
- **多娜多娜** `nsfw?`
  ```text
  1girl,solo,onono_imoko,yellow background,cowboy shot,colorful background, lolita fashion
  ```
- **琴柳：博士，时代变了！**
  ```text
  saileach_(arknights),1girl,holding_assault_rifle,teahwear,indoor,alley,shooting,m4a1,solo,bullet_vest,hoodie,headphone,flag, {{white bodysuit}},smile, beauty eyes
  ```
- **†升天†**
  ```text
  1girl,chouzetsusaikawa tenshi-chan,stage_light, holding microphone,bent_over ,one_eye_closed,smile, pointing at viewer, from_below
  ```
- **JO~JO~**
  ```text
  1boy,solo,kishibe_rohan,slim
  ```
- **邪念**
  ```text
  1boy,Dragonborn,Dragon skin,red eyes,elegant,Paladin,[dragon Scale Armor],blood,cowboy shot,muscle,oil painting, dragon horns, dragon tail,White background,Dragon head
  ```
- **一米阳光**
  ```text
  1girl, detective hat, round eyewear, {{adjusting hat,one hand in pocket,}}, trench coat, brown coat, long hair,black hair,brown eyes, expressionless, half closed mouth, from behind, from above, looking at viewer, simple background
  ```
- **魔法少女**
  ```text
  magical girl ,pink hair,pink eyes, ,white gloves ,pink footwear,high heels,,pink footwear,pink bow,blue bow ,bow,brooch ,dress ,high ponytail, ,standing on one leg ,earrings,frilled dress ,frills, gloves ,hair bow,heart,jewelry,open mouth,anime
  ```
- **一等情事**
  ```text
  {Melina(Elden Ring)}, {{{fire eyes}}},{solo}, campfire,{{1girl}}, reach out hand,thin body, rain, "
  ```
- **镖客w**
  ```text
  [[w(arknights)]],1girl,argyle_hat,,top_hat,hat ribbon,red_ribbon,black_headwear,black_vest,blue_shirt ,collarbone,collared_shirt,long_sleeves,double-parted_bangs,evil smile,fangs,upper_teeth_only,fingernails,hand_up,card,holding_card,open_collar,open_mouth,pale_skin,red_background,black background,shirt,solo,facial_mark,tongue_out ,upper_body,vest,waistcoat
  ```
- **温室花园下午茶**
  ```text
  ultra-detailed, best chiaroscuro,artist:wlop,1girl,solo,head tilt,holding cup,long hair,white hair,hair flower, looking at viewer,red eyes,small breasts,white dress, steam, smile, tiered tray, fruit, cake, sitting, table, food, white capelet, tea,tea set, tree,day, rose, greenhouse garden, indoors, outdoors, blurry foreground, cowboy shot, from side
  ```
- **老师，太阳要升起来咯**
  ```text
  {plana_(blue_archive)},artist, {evil smile,half open mouth},{big tree},1girl,{{expressionless, closed mouth}},black skirt, hair bow, city lights, school uniform, comet, derivative work, , lake, landscape, long sleeves, making-of available, outdoors, {closed mouth, upper body, looking back, looking at viewer, from behind, arms behind back}, p.art, white bow, white bowtie, long black skirt, star (sky) ,sunset, traditional media, wide shot
  ```
- **谎言也能成为爱吗**
  ```text
  {Hoshino Ai}, {{NEEDY GIRL OVERDOSE}},1girl,solo,tears,shaded face,insincere smile,look back,lackluster,colourful,On the stage
  ```
- **抽烟有害健康**
  ```text
  {Lunafreya Nox Fleuret(ff15)} artist, 1girl,black jacket,black necktie,chain,cigarette ,cigarette pack,hair orgcollared shirt,cross,metal hair ornament, ,breast,dress shirt,ear piercing ,earrings,holding ,holding cigarette pack, jacket,jacket on shoulders, jewelry,latin cross,teech,long sleeves,looking at viewe,female focus,mismatched earrings,mouth hold,multiple rings,necktie,open mouth,piercing,print necktie,,prosthesis,prosthetic arm,prosthetic hand,ring ,shirt, long hair,simple background,smile ,smoke,smoke trai,smoking ,solo, stud earrings,upper body,white background,white shirt
  ```
- **工作结束**
  ```text
  gawako arknights lappland_(arknights) texas_(arknights) texas_(willpower)_(arknights) commentary symbol-only_commentary 2girls animal_ear_fluff animal_ears black_coat black_gloves black_hair blood blood_on_face broken_mirror coat faucet glass_writing gloves hair_between_eyes hair_ornament hairclip heart holding holding_sword holding_weapon indoors long_hair looking_at_another looking_back mirror multiple_girls official_alternate_costume orange_eyes ponytail red_shirt reflection scar scar_across_eye shirt sidelocks sink sword tile_wall tiles very_long_hair weapon white_hair wolf_ears yuri
  ```
- **对弈**
  ```text
  {{mostima_(arknights)},arknights ,spoilers 1girl 1other black_background blood blood_on_face board_game chess chess_piece chessboard crown demon_horns disembodied_limb dress glint holding holding_crown horns jewelry long_dress long_hair long_sleeves open_mouth pawn_(chess) pink_hair reflection ring rook_(chess) solo_focus
  ```
- **红黑魔女** `nsfw?`
  ```text
  jewelry,year_2023,1girl,{{solo}},dynamic angle,smile,looking at viewer,hand on breasts,cleavage,medium breasts,red eyes,black hair,long hair,half-updo,multicolored hair,red hair,cape,witch hat,[black leotard,long dress,fur], see through clothes,hair flower,elbow gloves,pantyhose,forest,{red flower,floatting petals},CROW,at night,open mouth,purple sky,upperbody,blue moon,{flower wand},fog,blurry background,upperbody
  ```
- **大喜**
  ```text
  blush,{{earrings,hair stick,hair ornament,tassel,Qipao, rouge,long hair,red head veil}}, {Ancient Chinese streets,Chinese Jiangnan water town,bright moon,night,}},petals floating all over the sky,fireworks, [[focus on face]],fluttering hair,dynamic_perspective,Strong contrast,clever light and shade,light and shadow,depth of field,light spot, reflection, upper body
  ```
- **浅滩**
  ```text
  {{blue_poison_(shoal_beat)_(arknights)},,year_2023,jojo_pose,jojo style
  ```
- **阳奈**
  ```text
  hina_bluearchive,,year_2023,hand on face,Spotlight,1girl,stansing,upperbody,looking at viewer,white hair,leather jacket,bare shoulder sweater,skirt,black pantyhose,brick wall,white petal,poster on wall,black nails
  ```
- **圆焰**
  ```text
  2 girl,kaname_madoka ,akemi_homura,white wings,black wings,head up, flying,black feather, ,upside-down,kiss, multicolored background
  ```
- **魔女之恋**
  ```text
  flat color,1girl,solo,mature female, white hair,long hair,blunt bangs,hair over one eye,purple eyes, blank eyes,witch hat, black robe,long sleeves, table,head rest,elbows on table, on chair, vase
  ```
- **sama酱**
  ```text
  year_2023,15_year_old girl,students,solo,looking_at_viewer,front_view,{very_short_azure_hair}
  ```
- **格温**
  ```text
  {{gwen \(league of legends\)}},1girl,{{oversized object, scissors}},{{maximalism}},\\\cinematic lighting,{{fighting stance}},(disheveled hair),{dark heme},chiaroscuro,foreshortening,(colorful splashes),(shining),[focus on face],Glowing skin,Strong contrast,clever light and shade,{Backlight},Upper body,blowing wind,dynamic hair,dynamic_perspective,disheveled hair,long hair,dynamic pose,genji (overwatch) (cosplay)}}}
  ```
- **死神Q**
  ```text
  {{detailed eyes}},1girl,best,quality,highly,detailed,ultra-detailed,illustration,incredibly_wallpaper,artbook,death,(Death Scythe),cloak,black background,bone,Monster,saint-like,Frightening,flesh,{mural},watercolor,undead,soul,watercolor,colorful
  ```
- **送葬人**
  ```text
  year_2023,1other,{{plague_doctor_mask}},plague doctor,android, barcode,cable,cyberpunk,glowing red eye,helmet, industrial pipe, jacket, machine, mechanical, mechanical parts, metal, robot, science fiction, screw, shiny,solo, close-up,top hat,{{adjusting hat}}
  ```
- **盐系少女**
  ```text
  1girl,halftone background, upper body, purple eyes, heart-shaped pupils, thick arms, freckles, hairband, leg warmers, sarashi, leg up
  ```
- **赛博百百世** `nsfw?`
  ```text
  centipede, himemushi momoyo (touhou), cyberpunk, neon palette, colorful, [[greyscale]], vaporwave, from above, colorful, solo, realistic skin, glowing tattoo, glowing eyes, blue eyes, nude, colorful background
  ```
- **电影**
  ```text
  {{{{{{{film_strip,film_strip_on_screen,film_strip_on_background}}}}}}},{{colorful}},light_flare,1girl,upper body,black jacket,short hair,camera,camera in hand,hand up,look at viewer,{{abstract_background}}
  ```
- **血龙斩**
  ```text
  {{dusk_(arknights)}},{{{{{ink wash painting,jidao huashi}}}}},{1girl},lineart, monochrome,{{red sword}},cinematic lighting,{{fighting stance}},(disheveled hair),{dark heme},chiaroscuro,foreshortening,(colorful splashes),(shining),[focus on face],Glowing skin,Strong contrast,clever light and shade,{Backlight},Upper body,blowing wind,dynamic hair,dynamic_perspective,disheveled hair,long hair,dynamic pose,,{ink_wash {eastern dragon}, eastern dragon surrounds sword,genji (overwatch) (cosplay)}}}
  ```
- **昨日青空**
  ```text
  honeycomb (pattern),glowing,1girl, backpack, bag, black hair, blue sky, building, cloud, green skirt, grey hoodie, grey jacket, hood, hoodie, jacket, ligne claire, limited palette, long sleeves, outdoors, pleated skirt, railing, scenery, shoes, short hair, sitting, skirt, sky, solo, stairs, utility pole,{{{pastel color}}}, {{{{{minute details}}}}},colorful,(fusion of {{pixel line pixel pattern super pixel}},dynamic angle,dynamic pose,dynamic pov
  ```
- **在时光的洪流中，我们都是匆匆过客。不必留恋，也无需缅怀。**
  ```text
  Kal'tist(arknights), 1girl,((neck)),(((back))),star sky,(looking back),{minimalism},{Ink painting},{{ink splashing}}, {{Ink wash painting}},blending,limited palette
  ```
- **Weight of the World**
  ```text
  stage light,abandoned, animal, bird, day, dilapidated, escalator, indoors, moss, no humans, overgrown, post-apocalypse, railing, ripples, ruins, rust, sunlight, tree, water
  ```
- **星间女巫**
  ```text
  cyberpunk,solar system,artificial satellite,fisheye, space, star (sky),sun,plant, earth (planet), star system,long hair, {{witch hat}}, black hair, headgear, very long hair,medium breasts,{white cloak},white latex,{mechanical parts},black eyes, flying, broom
  ```
- **天际行者**
  ```text
  mostima (arknights),lineart,{greyscale},monochrome,speed lines, [[rough lines]],halftone,{comic},1girl, faceless, energy wings, black horn, black halo, blue hair ,floating hair, gloves, falling, in city,skyscrapers, boots, black footwear ,holding staff towards viewer, staff, back, from behind, upside-down
  ```
- **白洲梓**
  ```text
  azusa_(blue_archive),year_2023,1girl, scenery, train interior, cowboy shot, blue eyes, medium hair, ponytail, sit on,look through the window,flipped hair, stomach, hooded cloak, yukata, spoken heart, drinking, {cat print}, snowflakes
  ```
- **终末都市纪行**
  ```text
  mudrock (arknights),cowboy shot,masked, blurry foreground,1girl, abandoned, ad, air conditioner, arm up, bandaid, black gloves, bleach \(chemical\), boots, bottle, breasts, building,hammer, car, cleavage, clutter, collarbone, collared jacket, combat boots, crate,fewer digits, film grain, gloves, graffiti, hatching \(texture\), jacket, ladder, lamppost, limited palette, looking at viewer, motor vehicle, open clothes, open jacket, pants, pants tucked in, plant, potted plant, power lines, shadow, sharp teeth, shoe soles, shoelaces, sign, {sitting on car}, sleeves rolled up, slouching, snout, solo, teeth, trash bag, utility pole, wide shot, yellow background,dutch angle,perspective
  ```
- **亚特兰蒂斯狂想曲**
  ```text
  {{furina_(genshin_impact)}},1girl,solo,{{play the violin}},underwater,float hair,close eyes,smile,beautiful style,{{close shot}}, condensation,full body，elegant,artist:ark
  ```
- **布都御魂**
  ```text
  1girl,two side up,long hair,large breasts,{{{Traditional Ancient Chinese Imperial Guards Costume}}},fox ears,katana,bridal_gauntlets,katana,weapon,armor,Simple background,{{cyberpunk}}, mask,machine,fighting
  ```
- **错玉切**
  ```text
  portrait,{(Taoist robe, holding sword)},raining,{{fighting posture, serious, holding the sword, rain on the body}},{[focus on face]},Glowing skin,single braid,{China Jiangnan water town style,}lack and white color scheme,strong backlighting, volumetric lights, smoke volutes,Upper body,blowing wind,,{element energy surrounds the character},dynamic hair,{{gas floating all over the sky}},{bamboo forest, bamboo leaves falling around the scene,dark green color picture} exhale,{bamboo leaf (around the center of the character's body picture)},dynamic_perspective,Strong contrast,clever light and shade,light and shadow,depth of field,light spot, reflection, upper body
  ```
- **二号机-改**
  ```text
  {{eva 03}},{{standing}},warehouse,Indoor, dim,year_2023,[Giant feeling],{solo}, {CG unity ultra-detailed,depth of field},{best illumination, best shadow, an extremely delicate and beautiful}
  ```
- **鲸鱼之歌**
  ```text
  {{{{1 huge_cetacea}}}}, {{flying_cetacea}}, floating, in sky, artist, [starry sky], game_CG, no human
  ```
- **印象风格**
  ```text
  mostima (arknights),minimalism,{faceless},black skin,portrait,{no_lineart}, simple_background,black_background,blending,flat color,limited palette ,high_contrast,blue_hair
  ```
- **旋律の魔女**
  ```text
  {{{oktavia_von_seckendorff,road}}},{{{no humans,surreal,abstract,silhouette,madoka_runes}}}, artist:machigami_yoh,dress,{{{{{gear}},{{pointer}},Pen,yey ball,{trombone},energy_wings,piano_keys ,musical_note ,violin,accordion}}}, red eye ball, teeth,solo, {{{upside-down}}}, parody, frills, {{{witch's_labyrinth,sky}}}，night,backlighting ,stained_glass,candle, out door,, [[[[[[[[bone]]]]]]]]
  ```
- **一方像素**
  ```text
  {{{pixel_art}}},{{neon palette}},purple,pink,City, Street,{{{{isometric}}}},white background
  ```
- **交融**
  ```text
  surtr (arknights),ink painting，Ink theme, A big Charizard 's silhouette，foggy background ,breasts,dynamic pose,in the art Museum,a female girl ,high contrast,comic painting,sketch painting,{colorful sketch},beautiful detailed background, from back, dynamic angle, squirtle is next to the girl.(of rain) fall from the sky,{{Debris falls from the sky, reflecting the characters}},{{a blue mirror fragment}}
  ```
- **消逝**
  ```text
  {{ff_gradient}},{{pastel_colors}},{{split theme}},film grain, [glitch],lens_flare,{colorful},{chromatic aberration},{super wide angle},dynamic pov},smile,closed mouth,Intense emotional expression: death,1gril,hand,room,fire,{tears}, despair,pink and blue hair,medium hair ,ahoga,[torino_aqua],anime, {artist}
  ```
- **宝石魔女**
  ```text
  year_2023, {no humans, surreal, abstract, silhouette}, colorful, {{{solo}}}, {{{{chimeraz}}}}, monster girl, mocha, [Colorful Jewelry sculpture of human form], {{Transparent Multicolored Colorful Jewelry body}}, {silme body, {{jewel, diamond, emerald, crystal}}), [Cthulhu], madness, magic,{{In the sky, Floating, Ruins}}, night, backlighting
  ```
- **哎呀，面包长脚逃跑啦**
  ```text
  Rosmontis/amiya(arknights),2girls,multiple girls,,Bump into,sliced bread in the mouth,running,minimalism,colourful,{no_lineart},,simple_background,white_background,blending,flat color,illustration
  ```
- **饕餮的魔女**
  ```text
  watercolor pencil (medium), {{abstract}}, colorful,solo, huge round mouths, multiple mouths,sharp teeth, faceless, no eyes, monster girl, black hole in face, dragon, horns, chinese clothes, mouth on stomach
  ```
- **麻雀茶会（秋）（冬）**
  ```text
  1girl,no_lineart,acorn, acrylic gouache \(medium\), acrylic paint \(medium\), animal, animal focus,winter, winter leaves, bird,scarf, fur, brown eyes, headwear, grey theme, winter theme, open mouth, clothed animal, cup, eurasian tree sparrow, full body, bread,pie, glass plate, glass teacup, glass teapot, gouache \(medium\), kettle, looking to the side,snow, painting \(medium\), plaid,smile, solo, sparrow, standing, tea, teacup, teapot, steaming, oven, cook book, soup,traditional media
  ```
- **也许是张窗花**
  ```text
  2girls,{red and white monochrome}, silhouette, red background, simple background, saigyouji_yuyuko_(touhou) and yakumo_yukari_(touhou), bust, upper body, front view, facing the lens, group picture, back to back
  ```
- **GAME OVER**
  ```text
  Nanami ChiaKi(Danganronpa),[[[[flat color]]]]}}, [weird core art], {glitch art}, [[mosaic, internet aesthetics, aberrant art]], anime style, {solo}, {{1girl}},reach out hand,{Error popup},tearing eyes, high quality
  ```
- **莫氏早餐**
  ```text
  {{{{huge toast}}}},{{{{girl under toast}}}}, toast coverd,{{{mostima (arknights)}}}, chibi,:3;o_o,fried_egg,[[artist:As109]],year_2023,solo,1girl,bread,bread slice , head tilt ,lying ,on stomach, toast ,flying_sweatdrops
  ```
- **一寸田园**
  ```text
  1girl,animal ears, black wings, blonde hair, bow, broom, brown hair, candle on head, cottage \(building\), crescent, demon wings, fox ears, fox tail, ghost costume, hair ornament, halloween, happy halloween, hat, holding, holding broom, holding wand, house, long hair, mermaid, monster girl, multiple boys, multiple girls, nurse, nurse cap, on roof, orange bow, pink hair, pixel art, prison clothes, short hair, signature, sitting, sitting on roof, skull hair ornament, smoke, sparkle, star \(sky\), tail, tree, vampire, very long hair, wand, white hair, window, wings, witch, {{fruits}},{{mimosa}},orchid,{{{pastel color}}}, {{{{{minute details}}}}},colorful,(fusion of {{pixel line pixel pattern super pixel}}),dynamic angle,dynamic pose,dynamic pov
  ```
- **Stable CP**
  ```text
  1boy, gojo satoru(jujutsu kaisen) grabbing Makima(chainsaw man),ray tracing,(1girl,medium breasts,red hair,yellow eyes,casual,nose,white bra,thigh,upper body,arms behind back,bedroom), 1boy with blue eyes,white hair,black suit, hand on another's waist, hand on another’s back,grabing another’s breasts,groping,face to face
  ```
- **要来一杯冰冻史莱姆吗？**
  ```text
  year_2023, no humans, cup, :3,{{cat slime}},transparent slime,slime in the teacup
  ```
- **水着**
  ```text
  {{plana (blue archive)}}, full body,half-closed eyes,steam,swimming ring, heavy breathing, wet hair, small breasts,bikini, parted lips,breasts focus,white background, loose hair,steaming body,dynamic pose,sky,sunlight,blue hawaii,blurry foreground
  ```
- **可爱风兔兔** `nsfw?`
  ```text
  [amiya (arknights)], solo, loli, jitome, covered mouth, full-face blush, sitting, pillow hug, large pillow, leg lock, [[[uniform, black pantyhose, no shoes]]], on bed
  ```
- **可爱风Plana** `nsfw?`
  ```text
  plana (blue archive), solo, loli, sunglasses, uniform, adjusting eyewear, looking at viewer, :<, one eye closed, elbow rest, upper body
  ```
- **卡比兽**
  ```text
  2 pokemon, (snorlax (pokemon),mew (pokemon), light smile,kawaii,looking at each other, on grass,dynamic pose, fruits,Berry, no, artist:ciloranko, 2 pokemon, (snorlax (pokemon),mew (pokemon), light smile,kawaii,looking at each other, on grass,dynamic pose, fruits,Berry, no
  ```
- **波奇大魔王**
  ```text
  sketch,chibi,{{gotoh_hitori,}}, "a girl in a cute pink dinosaur onesie,blowing extremely huge fireball from mouth",year_2023,{{open mouth}},full body,{{outdoors}}, giant, {solo}, {{1girl}},Modern City,frontal view,angry,Open arms,runis,explosion
  ```
- **蒸汽风格**
  ```text
  glowing, 1girl, @ @, black hair, black skirt, blue background, blue jacket, border, distress, green eyes, hair intakes, hands in hair, jacket, long sleeves, lower teeth only, open mouth, outside border, pleated skirt, short hair, skirt, solo, sweat, teeth, upper body, white border, zipper pull tab,(fusion of {{pixel line pixel pattern super pixel}},dynamic angle,dynamic pose,dynamic pov
  ```
- **蒸一下** `nsfw?`
  ```text
  pink and blue and red theme,threepoint perspective,Rei Ayanami,{{{{{vaporwave}}}}},[[glitch,[pixel art]]],{neon palette,film grain,retro {gradient sky},{{}},分,,solo,分,nsfw,分,,year_2023
  ```
- **芙卡洛斯猫猫**
  ```text
  [[[furina (genshin impact)]],no humans,{{cat}}, hair ornament,,smile
  ```
- **七维炫彩**
  ```text
  honeycomb (pattern),glowing,1girl, 2024, bare shoulders, black hair, blue eyes, chinese zodiac, double bun, dragon girl, dragon horns, earrings, facial mark, finger cots, flower, glasses, hair bun, hair flower, hair ornament, hairclip, heart, heart facial mark, holding, holding smoking pipe, horns, japanese clothes, jewelry, kimono, kiseru, long hair, looking at viewer, off shoulder, pointy ears, print kimono, round eyewear, slit pupils, smile, smoking pipe, solo, teardrop facial mark, upper body, year of the dragon,{{{pastel color}}}, {{{{{minute details}}}}},colorful,(fusion of {{pixel line pixel pattern super pixel}},dynamic angle,dynamic pose,dynamic pov
  ```
- **颠**
  ```text
  glitch art,chaotic art,cyber background,vibrant colors,colrful,{{high_contrast}},{{glitch_background}},1girl,solo,{{{glitch screen}}},{{{multiple_colored_hair}}},long hair,floating hair,blue eyes,{{[glowing eyes}}},multiple_colored_jacket,look at viewer,hands on face,seductive smile,{{neon light,neon pink,reflection}},{{flower_in_background}}
  ```
- **“癫”**
  ```text
  {split theme},chouzetsusaikawa_tenshi-chan,solo,portrait,{{{sketch, colored lineart, colorful, multicolored stripes, colored stripes, color issue, changing colors, color contrast, high contrast, alternate color,colored skin}}},lowres, {bad},worst ,quality,bad quality, multicolored background
  ```
- **奇迹**
  ```text
  {{ff_gradient}},{{limited_palette}},high_contrast,inverted_colors,colorful,{Stunning composition},Intense emotional expression: the unconscious pain after the death of a loved one,1gril,anime, [year_2023]
  ```
- **秘奥义.大葱居合斩**
  ```text
  ，{{{holding spring onion, spring onion}}}, serious expression,1 girl,solo, dynamic angle,dutch angle,{{foreshortening,perspective, fisheye lens}} ,simple background, full body, squatting, on one knee
  ```
- **动画原画风格**
  ```text
  (color trace,animation paper},production art,limited palette,methods: 1. We haven't heard reports of deaths, will check into it; 2. The people were killed, but by a faulty Palestinian rocket/bomb; 3. OK we killed them, medium breasts,but they were terrorists; 4. OK they were civilians, but they were being used as human shields; 5. OK there were no fighters in the area, so it was our mistake. But we kill civilians by accident, they do it on purpose; 6. OK we kill far more civilians than they do, but look at how terrible other countries are! 7. Why are you still talking about Israel? Test this against the next interview you hear or watch. Adam Johannes, Secretary
  ```
- **流金**
  ```text
  1girl,dress,fourth east high school uniform, head rest, looking at viewer, pinafore dress, school uniform, sleeveless, sleeveless dress, solo,{focus on face},glowing skin,black and white color scheme,strong backlighting,portrait,volumetric lights,city street,volutes,Upper body,Mystical cultivation,blowing wind,Fire light,dynamic hair,dynamic_perspective,Strong contrast,clever light and shade,light and shadow, depth of field, reflection
  ```
- **溢彩**
  ```text
  illustration, acrylic paint, pastel_(medium),1girl,artist:shimhaq
  ```
- **旧番风格**
  ```text
  1girl, solo, thighhighs, stuffed toy, stuffed bunny, pink eyes, white thighhighs, stuffed animal, pink hair, bangs, smile, looking at viewer, long hair, hair intakes, holding, dress, bare shoulders, closed mouth, two side up, hair ornament, virtual youtuber, off shoulder, holding stuffed toy, shoes,cowboy shot, ribbon, long sleeves, multicolored hair, white jacket, pink ribbon, white hair, bow, braid, white dress, hair between eyes
  ```
- **水彩风格**
  ```text
  furina \(genshin impact\),{{{{watercolor (medium), traditional media, painting (medium)}}}} ,,1girl, animal ear fluff, animal ears, ascot, asymmetrical gloves, black gloves, blue ascot, blue jacket, blush, cat ears, cat girl, cat tail, closed mouth, disembodied limb, facing viewer, gloves, hand on another's chin, heart, jacket, kemonomimi mode, long hair, long sleeves, mismatched gloves, simple background, solo, tail, upper body, white background, white gloves, white hair
  ```
- **夏日**
  ```text
  Magallan arknights，，1girl,colorful background, white thighhighs, green dress, long sleeves,river side,lying on the ground
  ```
- **描边风格**
  ```text
  outline,no_lineart,1girl,intimate embrace, soft lighting, romantic atmosphere, close connection, passionate moment, deep affection, privacy, warmth, comfort, tender touch, expressive faces, emotional depth, love, sensuality, cozy bedroom environment
  ```
- **摄影风格**
  ```text
  photo background,1girl, arms at sides,lack hair, blush,facing viewer, floating hair, long hair, open mouth, outdoors, scenery, smile, solo, thick eyebrows, upper body, white dress, wind,building,city
  ```
- **画中画风格**
  ```text
  1girl, original, :q, animal ear fluff, animal ears, art tools in frame, blue flower, bow, bowl, braid, bright pupils, brown headwear, capelet, chopsticks, closed mouth, colored pencil (medium), crossed bangs, eating, floral background, flower, food, fur-trimmed capelet, fur trim, green hair, hair bow, hair flower, hair ornament, hands up, hat, hatching (texture), holding, holding bowl, holding chopsticks, japanese clothes, kimono, long hair, long sleeves, mochi, mochi trail, orange eyes, photo (medium), pink bow, pom pom (clothes), rabbit, rabbit ears, rabbit pin, red bow, smile, solo, tam o' shanter, tongue, tongue out, traditional media, twin braids, upper body, white pupils, wide sleeves, zouni soup
  ```
- **夜空下的天使** `nsfw?`
  ```text
  1girl, sex
  ```
- **未花蓄意轰拳老师并逃逸事件概要（**
  ```text
  1girl,1boy,mika (blue archive),{{doodle_sensei_(blue_archive)}}, sensei (blue archive),画风,{face focus},{close-up},two-tone background,{{perspective}},>_<,smile,{running},{{{run to the viewer}}},speed lines
  ```
- **旷野之风**
  ```text
  illustration,{{blue flowers}},{1girl,solo},siting,hillside,turn around,white hair,long hair,green eyes,white robe,twin ponytails,coat,earrings,jewelry,parted bangs,pointy ears,floating hair,floating clothes,{{{from above}}},{wide shot},mountainous horizon,among flowers,backlighting,limited palette,{field s of flowers}
  ```
- **漫画风格**
  ```text
  {{{goldenglow(arknights)}}},{{{{{{{1girl}}}}}}},posting letter,from side,face focus, blood on face,wicked smile,{{{open mouth}}},blush, stream,close up,{{{{{ink wash painting,jidao huashi}}}}},{1girl},lineart,moonlight, monochrome,cinematic lighting,{{fighting stance}},(disheveled hair),{dark theme},chiaroscuro,foreshortening,(colorful splashes),(shining),Glowing skin,Strong contrast,clever light and shade,{Backlight},Upper body,blowing wind,pond,dynamic hair,dynamic_perspective,disheveled hair
  ```
- **也许是只龙泡泡**
  ```text
  nian(arknights),meme,anime style,画风,chibi,{{1girl}},dragon,{{{minimalism}}}, >_<,portrait,solo,black and white,{{no lineart},angry,aiming at viewer,{{POV}},{{{front view}}},{{{facing viewing}}},dramatic shadow
  ```
- **西部天使**
  ```text
  ，year_2023,Cowboy Shot, high quality, anime style, {solo}, {{1 man, 60 years old man}}, {{light wings}}, {clean face, short hair, suit, black cowboy hat, angel halo, revolver, left hand aiming at viewer}, lean build, {tall build}, high height, street background
  ```
- **影武者**
  ```text
  year_2023,Extremely exquisite facial description,armor,A sword ,Crusaders, Knights, Templar Knights, Hospital Knights, Iron Cross, Malta Cross,cinematic lighting,{fighting stance},(disheveled hair),chiaroscuro,foreshortening,(colorful splashes),(shining),[focus on face],Strong contrast,clever light and shade,{Backlight},Upper body,blowing wind,dynamic hair,dynamic_perspective,disheveled hair,long hair,dynamic pose
  ```
- **彩**
  ```text
  {{2 girls}}, yuri,crystal, crystal hair,indoors,window,blue flower, bouquet, branch, camellia, fuzichoco,cherry blossoms, chrysanthemum, glowing butterfly, japanese clothes, kariginu, layered sleeves, orange flower, pink flower,white flower, purple flower, red flower, ribbon-trimmed sleeves, ribbon trim, see-through sleeves, wide sleeves,{{}}, anime, ωstar, chen bin,atdan,hito,hiten,mignon,satou kuuki ,puririn,miyashiro ryuutarou,torisan.
  ```
- **静谧花园** `nsfw?`
  ```text
  3d,loli,half updo, curvy, asymmetrical bangs, straight hair, hime cut, long pointy ears,,,,{{{depth of field, shadow,reflective, ray tracing}}}
  ```
- **条纹背景法**
  ```text
  {canonical composition},neat diagonal striped background,{{blue with white striped background}},{limited palette},flat colored,blue and white,no human
  ```
- **咕噜咕噜滚下山真君**
  ```text
  ganyu_(genshin_impact),sheep cosplay ganyu_(genshin_impact),{{stuck}},honeycomb (pattern),画风,chibi,no human,lying,slope,[[[roll down the hillside]]],blue sheep,[[[[[blue wool]]]]],blue hair,ganyu_(genshin_impact) goat horns,yellow bell,black limbs,ganyu_(genshin_impact) ornament ,[hillside],[distant view]
  ```
- **真菜啊 这就不行了？** `nsfw?`
  ```text
  [[[silver wolf (honkai: star rail)]]], solo, loli, {{bags under eyes}}, jitome, tired, close-up, holding monster energy, tin cans, black background
  ```
- **刃牙**
  ```text
  (deep of field,photo background,blurry background),ainu clothes,animal,animal focus,animalization,blue eyes,clothed animal,earrings,from side,full body,headband,hoop earrings,jewelry,leg warmers,long sleeves,looking up,mouth hold,no humans,profile,running,short sword,simple background,solo,sword,weapon,weapon in mouth,white backgrounad,wolf
  ```
- **绅士猫**
  ```text
  1cat, cat close up, {Cat in black top hat, cat in red bow tie, no one, cat on a park bench}
  ```
- **边缘检测**
  ```text
  1girl, :o, black gloves, blue-framed eyewear, blue neckerchief, blue scarf, chair, eyewear on head, feet out of frame, gaming chair, glasses, gloves, hand on lap, hat, jacket, long sleeves, looking at viewer, neckerchief, on chair, open clothes, open jacket, outline, partially fingerless gloves, purple background, purple headwear, purple jacket, scarf, school uniform, serafuku, shirt, sitting, socks, solo, striped, striped scarf, swivel chair, white outline, white shirt, white socks
  ```
- **哥 你弄疼我了`(*>﹏<*)′**
  ```text
  1boy,1girl，brown gloves, brushing another's hair, brushing hair, fingerless gloves, gloves, hair brush, jewelry, open mouth, popped collar, ribbed shirt, ring, shirt, short sleeves, sitting, sweatdrop, two-tone background, yawning
  ```
- **小鸟游星野**
  ```text
  solo,portrait, ,{high contrast, colorful, detailed light, light leaks, sunlight, shine on girl's body, beautiful detailed glow, best shadow, wet skin, shiny skin, cinematic lighting, lens flare, ray tracing, from side, bokeh, blurry foreground,1girl, small breasts, long hair, disheveled hair, cute, sunny, tears in eyes
  ```
- **蓝调**
  ```text
  1 girl,solo,bare shoulders, black skin, blue eyes, blue feathers, blue hair, body freckles, butterfly wings, chain, colored eyelashes, colored sclera, drop earrings, ear piercing, earrings, feather hair ornament, feathers, freckles, grey dress, grey sclera, jewelry, long hair, looking at viewer, monster girl, multicolored eyes, pink eyes, pointy ears, purple background, sideways glance, small breasts, streaked hair, upper body, white hair, wing eyes
  ```
- **草稿风格** `nsfw?`
  ```text
  1girl, arm up, belt, black bra, black collar, blue eyes, bra, breasts, collar, detached sleeves, eyewear on head, fanny pack, grey background, grin, hair over one eye, holding, looking at viewer, medium hair, midriff, multicolored hair, navel, purple belt, red hair, shorts, simple background, sketch, sleeves past wrists, small breasts, smile, solo, streaked hair, underwear, vest, white hair, white shorts, white sleeves, white vest
  ```
- **像素风格**
  ```text
  nahida (genshin impact), {pixel art, perfect pixel and 8-bit, dithering}}, 1girl
  ```
- **三人成行**
  ```text
  3 girls,,3 girls, Detail Eyes, light blush, shy, blush, half-closed eyes, princess_carry, {{{maid apron}},{{maid dress}}}, cafe, restaurant, horns,pointy ears,arm tattoo, black hair,white hair,blue hair,tail, tattoo, necktie, jewelry,vase,strapless, hair over one eye, sitting, breasts, sisters, boots, black coat, jacket, dragon girl, streaked hair, black shorts, colored skin, smile, purple eyes, lantern, bare legs,very long hair, bracelet, cup, bead bracelet, earrings, braid, bangs, short hair, indoors, chinese clothes, long sleeves, holding cup, bare shoulders, tassel earrings, tassel, midriff
  ```
- **海风的声音**
  ```text
  photo background,1girl,blue sky,brown hair,camera,holding camera,hood,hooded jacket,ocean,outdoors,short hair,Sky,smile,solo,taking picture, white jacket 81k ? wind, wind lift
  ```
- **班门弄斧**
  ```text
  mika (blue archive),画风1girl,Face the wall,{{{wall}}},{{{{{{{punching},{{breakdown}}}}}}}},shake fist at the wall,from behind,broken_wall, impact_damage, crumbling_structure
  ```
- **苍色回忆**
  ```text
  {parametersTHE SKY}, blue rose background,{{{1boy}},solo,cold face, unhappy,white hair,blue streaked hair,short hair,wavy hair,white jacket , {{panda hood}},cowboy shot,open cardigan, solo focus,{high contrast, colorful, detailed light, light leaks, sunlight, shine on boy's body, beautiful detailed glow, best shadow, wet skin, shiny skin, cinematic lighting, lens flare, ray tracing, from side, bokeh, blurry foreground
  ```
- **蝴蝶之梦**
  ```text
  year_2023,，
  ```
- **脑垫波** `nsfw?`
  ```text
  {{Doctor, sleep on your desk}}, {{Frostnova, Arknights, lap pillow}}, year_2023,Cowboy Shot,upper body, high quality, anime style, {{1girl,1boy}}, skinny, sexy, {{large medium breasts}}
  ```
- **初体验**
  ```text
  furina \(genshin impact\),1girl, ahoge, bandaid,white hair blonde hair, blue hair, blush, wet,bow, flirt, hands on another's face,lying, hand on another's cheek, bowtie, bedroom,on bed, fingernails,bra,heterochromia, holding, holding hand, looking at viewer, kissmulticolored hair, open mouth, pov, school uniform,open shirt,open skirt, two-tone hair
  ```
- **流火**
  ```text
  1girl,ahoge,asymmetrical legwear,black legwear,black shorts,breasts,chain,cleavage,dutch angle,floating hair,full body,grin,hair between eyes,holding,holding sword,holding weapon,long hair,looking at viewer,medium breasts,midriff,navel,red eyes,red hair,short shorts,shorts,single thighhigh,smile,solo,stomach,sword,thighhighs,uneven legwear,very long hair,volcano,weapon
  ```
- **向日葵少女**
  ```text
  1girl,white pantyhose,slender,narrow waist,{straight hair},medium breasts,{{blue inner hair}},{blue eyes,aqua eyes},{dark purple hair},long hair,ponytail,parted bangs, :d, black ribbon, blue sky, braid,cloud, collarbone, cowboy shot, day, dress, earrings, eyelashes, field, fingernails, flower, flower field,hair ornament, hairclip, hand up, hat, holding flower, hugging object, jewelry, lace-trimmed dress, lace trim, looking at viewer, pink nails, ribbon, ring, see-through, see-through sleeves, short sleeves, signature, sleeve ribbon, smile, straw hat, summer, sun hat, sunflower, sunflower field,white dress, wind, wristband, x hair ornament
  ```
- **白鸟**
  ```text
  
  ```
- **猫の屋** `nsfw?`
  ```text
  sex
  ```
- **彩虹汉堡**
  ```text
  no human, sitting, Jellybean-stuffed dumplings, rainbow spaghetti, cotton candy foam, pickle-infused sorbet.
  ```
- **白之章**
  ```text
  1girl,{long hair},{divergent},round face,{{cute face}},{{Silver eyes}},{{Rembrandt light}},short neck，no_lineart,year_2023, shiny_skin,{{Rembrandt lighting}},backlighting, {{{side face}}},looking back at viewers,half body,star earrings,{{{light blue hair}}},{{pink hair}},{{{{streaked hair}}}},{{{gradient hair}}},eye focus, sparkling eyes,jewelry, motion blur,portrait, refraction, solo,beret,hoodie,asymmetrical legwear,puririn,bridal gauntlets,clothing cutout,detached sleeves,earrings,pantyhose,backless outfit,high heels,crystal footwear,earrings,frilled dress,hair bow,waist cape,white dress,cross-laced corset
  ```
- **蒸汽风格**
  ```text
  ，steampunk, Victorian, the industrial revolution, air cylinder, engine, metallic conduit, screw, dial, steam, dust, dynamic angle, 1girl, solo, small breasts, Side ponytail, solo, goggles, gloves, brown clothes, sweat, steaming_body, arm guards, prosthesis arm, bent over, worling, looking at veiwer
  ```
- **最后的魔女**
  ```text
  Ultimate light and shadow,cinematic lighting, anime screecap,Epic graphics,highest point, overlooking,1girl,solo,Witch, witch hat,long hair,light blue hair,Sitting on a broom, city, Early morning, the sun rises,hills,{{{modern city}}},rain, cloud
  ```
- **复仇恶灵**
  ```text
  no_human,Extreme landform, black rock, monochrome, grey sky, cowboy shot, undead, solo, skull, skeleton, skeletal arm, blue fire in eye, fire eye, glowing eye, cowboy hat, cowboy_western, fringe_trim, revolver, holding_gun, trigger_discipline, aiming at viewer, crack, blurry, rain, town, intense shadow
  ```
- **谨贺龙年**
  ```text
  long hair,{eastern_dragon}, flaming eye,white hair,japanese clothes ,gloves,{{solo}}, hair ornament,sash,sideboob, {{dragon tattoo}}, kimono,kimono dress,{back tattoo,arm tattoo},backless outfit ,looking at viewer,，healthyman,eluthe, {{{}}}, anime, ωstar, chen bin, atdan,hito,hiten,mignon
  ```
- **小憩**
  ```text
  saigyouji yuyuko,yakumo yukari,画风, {high contrast,colorful,detailed light, cinematic lighting, lens flare, light leaks, sunlight , shine on girl's body, beautiful detailed glow,ray tracing, best shadow,sunshine through window},,2girls, sitting together under a cherry blossom tree, looking at another, drinking sake, open mouth, yuri,blurry,maximalism, peaceful, serene, close-up,detailed background,depth of field
  ```
- **恭贺新春**
  ```text
  画风,landscape,Chinese festival,lantern,fireworks, dragon,wide_shot,moon,house
  ```
- **猎龙** `nsfw?`
  ```text
  fantasy, burning sky, explosion, flying flames,{{{{{piercing,dragon impaled by spear}}}}},{a girlflying}, dragon,cinematic angle, grand scene, summoning,{fire spear,magical,magic circle on spear,glowing,casting spell, glowing},{{{dragon:(bound dragon,magic chain,bondage,bound,bound legs,bound wings)}}},fire,solo focus
  ```
- **千金**
  ```text
  画风,1girl
  ```
- **A大真帅吧**
  ```text
  artorias the abysswalker ，dark souls (series)，Blood red sword, on one knee, broken armor, Injure a hand
  ```
- **雪韵枫香**
  ```text
  画风,scenery,tree,outdoors,snow,sunset,winter,autumn leaves,autumn,sky,leaf,water,mountain,wide shot,veranda,cloud
  ```
- **Death or Life**
  ```text
  画风, beautiful tree, {{root}}, red flower, red magic lily, bird, animal, Trunk texture, Death symbolism, Life symbolism, skull, corpse, blood, no humans, moss, light and shadow contrast, from below
  ```
- **背影**
  ```text
  [[[[lin_(arknights)]]]],画风,1girl,Chinese clothes,hanfu,from back,Chinese festival,at night,landscape
  ```
- **一般路过**
  ```text
  {{Mostima/Exusiai(arknights)},2girls},{{{Lappland(arknights)}},stand behind,Observing two girls,surprised,1girl,peeping},{{{3girl}}},artist:mochizuki,artist:40hara,画风,blush,breast sucking, breasts, clothes lift,grabbing, grabbing another's breast, hair between eyes,large breasts, long hair, long sleeves,open mouth
  ```
- **庙**
  ```text
  画风,chinese clothing,chinese dragon,chinese long,dragon glyph,dragon horn
  ```
- **高达踩人**
  ```text
  gundam,画风, //looking down, from below,{{tread,Stampede,}},dynamic angle, motion lines, Lifting the leg, mechanical foot focus
  ```
- **黑魂和背影**
  ```text
  {{{solaire of astora}}}, dark souls i, from behind, 画风,sunset ,backlighting,1boy, {{\o/}}, {{praise the sun}}, outstretched_arms, arms up, belt, brown belt, feathers, fur trim, helmet, knight, long sleeves, male focus, plume, simple background, solo, sun symbol
  ```
- **daring dance（rio）**
  ```text
  [[rio_(blue_archive)]],画风,{{high_contrast}},{{{color_guide}}},1girl,black hair,red eyes,alternate costume,pink shirt,pink bow,pink sleeves,detached sleeves,frilled sleeves,black skirt,frilled skirt,holding skirt,{{finger heart}},fishnet pantyhose,halo,pink background
  ```
- **草莓奶昔** `nsfw?`
  ```text
  cream on body,strawberry,画风,dynamic angle,from above,{incoming kiss},{{head out of frame}},1girl,naked ribbon,brown hair,solo,blush,wavy hair,twintails,hair flower,depth of field,pink background,open mouth,tongue out
  ```
- **龙年大吉**
  ```text
  画风,1girl,dragon girl,dragon horns,{{huge Chinese dragon}},long sleeves,hanfu,chinese zodiac,pink eyes,smile,solo,standing,wide sleeves,new year,holding,looking at viewer,bangs,year of the dragon,personification,happy new year,creature and personification,hair ornament,dango,:d,reflection, ray tracing, sunbeam, best illumination
  ```
- **午后的梳理头发** `nsfw?`
  ```text
  {{2girls}},(mint (arknights),black cat ears),goldenglow (arknights),loli,画风，year_2023,close-up,{{from outside}},looking at viewer,[cinematic lighting]],{god rays},indoors,flower pot,hair tie in mouth,hairband,hands up,holding,holding comb,holding hair tie,mouth hold,on chair
  ```
- **"一起？" "嗯“**
  ```text
  long hair,black hair,two side up,parted bangs,sidelocks,eyes visible through hair,lineart, 画风,year_2023,cowboy shot,blurry foreground,perspective,sunset,fallen leaves,{{subway station}},{wheat field},hairclip,beret,trench coat,sweater dress,necktie,standing,looking away,holding a sunflower
  ```
- **未锈铠**
  ```text
  {{ornate full armor}}, 1man, upper body,pauldrons,arms guards,red cape,{{{hands on hilt,Sword planting}}},{{{{thighs amputee}}}, {{{{{no head}}}}}}}}, white background
  ```
- **勇者抵达战场**
  ```text
  画风,gigantic {{{{skeleton}}}},{{skeleton dragon}}, cinematic lighting, {{{fighting stance}}},{{{intense angle}}},many people,blue_fire,from behind,{{fire on sword}},many skeleton,sparks,castle,armor,{{ bow (weapon) ,arrow_(projectile)}},open mouth,cape, fur-trimmed cape,pile_of_corpses ,wizard,greaves,belt, magic,corpses , glowing eyes,horn
  ```
- **背影**
  ```text
  1girl, 画风,night,sky
  ```
- **世界边缘的黄金树**
  ```text
  1girl, 画风,dark,armour,sword,ramparts,wide shot,cinematic angle , big golden tree,elden ring,World gold Tree,Golden trunks,Glowing tree trunks,glowing
  ```
- **篝火**
  ```text
  1girl, 画风,dark souls (series),armour,sword,bonfire,ruin,ramparts,Sit next to the campfire,dark, , wide shot,cinematic angle ,A sword was stuck in the campfire
  ```
- **阿米驴**
  ```text
  {amiya (arknights),donkey head,no human,cute donkey},upper body, white background
  ```
- **太空科幻**
  ```text
  画风，no humans,starry_sky,planet,many spacecraft,space,science fiction,war,star (sky),shooting_star,explosion,battle,realistic,firing,vector illustration,gravitation effects,rotating starry sky,caustics
  ```
- **新年大吉**
  ```text
  {{{amiya (arknights),big fireworks}},画风,{{{backlighting,floodlighting}}},New Year's Dragon Lantern Dance, looking at viewer, blush, smile, open mouth, hair ornament,holding,twintails, jewelry, upper body, flower, food, sky, indoors, white dress, head tilt, window, night, fruit, chinese clothes, table, holding food, plant, star \(sky\), night sky, china dress, plate, lantern, chopsticks, potted plant, reaching towards viewer, east asian architecture, feeding, vase, giving, shrimp, incoming food, lattice, chinese new year
  ```
- **幻海龙吟**
  ```text
  {{{green chinese dragon in fog,Vague and elusive,lying on Pirate ship,fog,Green vortex on sky,{{{backlighting}}},sea,storm,shadow,lightning}},画风,{{{backlighting,floodlighting,dark environment}}},claws, dragon,floating, glowing, scenery, sky
  ```
- **可可爱爱表情包**
  ```text
  {mint_(arknights) },，1girl,wariza,chibi,grey_hair,long_hair,smile,from_front,paw_pose
  ```
- **扬帆起航** `nsfw?`
  ```text
  year_2023,kaede_(sayappa),[[wlop]],[[[kase daiki]]],jima,[sheya],[[ciloranko]],[[[toosaka asagi]]],[[[tianliang duohe fangdongye]]],henreader, , loli,boobs hanging out of shirt,liquid metal girl,silver,nyotaimori, bed invitation, seductive smile, shikimi (yurakuru)
  ```
- **花季**
  ```text
  
  ```
- **晨光**
  ```text
  quasarcake,1girl
  ```
- **北冥有鱼**
  ```text
  graffiti of flowing, Hosaphone, Heidelberg School, Grayscale, Whale, jagged, sore, Chemogram
  ```
- **绫**
  ```text
  dark blue hair,blue eyes,long hair,1girl,solo,shiny skin,wet,movie tonal,cinematic lighting,blurry,shadow,light rays,ceiling view,medium breasts
  ```
- **碧落**
  ```text
  dusk_(arknights) ,1girl,curly hair,frills,from side,long hair,ong sleeves,outdoors,profile,sleeves past wrists,standing,green theme
  ```
- **金石之誓** `nsfw?`
  ```text
  symmetry,butterfly, NSFW {{shiny_skin}},year_2023, 1boy, 3girls, amputee, androgynous, armor, bare shoulders, black background, black cape, black hair, black pants, blonde hair, blood, blood on clothes, braid, branch, brother and sister, brown gloves, bug, butterfly, cape, circlet, closed eyes, dress, elbow gloves, flower, from side, gauntlets, gloves, gold needle, grass, holding hands, knee pads, leaf, long hair, long sleeves, looking at another, mirror image, missing limb, multiple braids, multiple girls, pants, pauldrons, profile, red hair, robe, rotational symmetry, seiza, short hair, shoulder armor, siblings, single braid, sitting, symmetry, torn clothes, very long hair, wavy hair, white dress, white robe, yellow flower
  ```
- **Koko**
  ```text
  year_2023,looking at viewer,dynamic angle,cowboy shoot,{leaning forward,breasts focus},hand on waist,demon wings,demon horns,demon tail,1girl,blonde hair,wavy hair,twintail,purple eyes,leading forward,jacket,{long t_shirt},shoulder slip, skull hair ornament,{{no skirt,no pant}},solo,{black pantyhose},black bra slip,{pink background,white outline}
  ```
- **MIKA**
  ```text
  year_2023,hair tucking,close mouth,beige coat,scarf,sketch
  ```
- **向未来出发**
  ```text
  tokai teio (umamusume), mejiro mcqueen (umamusume), running, motion blur, motion lines, sweat, blue theme, purple theme, side by side, glow, upper body, colorful, vibrant colors, blue sky, [artist:rei (sanbonzakura)], [[[artist:dino_(dinoartforame), realistic, photorealistic, artist:sushispin]]], , location
  ```
- **曼陀罗**
  ```text
  [artist:kedama milk],{artist:phantom_ix_row},artist:dishwasher1910,artist:liduke,{{artist:nixeu}},artist:dino_(dinoartforame), artist:Kidmo,[fkey],{artist:yoneyama_mai},1girl, disintegration, glitch, glitching, ,aesthetic, 8k, ethereal lighting, nighttime, darkness, surreal art, fantasy, spot color, pink and black theme, dark, sad, parted lips, floating hair, gothic, flora, black and thick liquid, fog, underlighting, bokeh, blurry background, strong visual impact, film lighting, different reflection, glass, breaking, shatter, reflection, glass shards, broken glass, reaching towards viewer, shatter across face, blood from eyes, split, glass over on eye, glass across face, glowing eye
  ```
- **桃花笑**
  ```text
  jiu niangzi, jiu niangzi (blossom spring fairy), 1girl, black eyes, black hair, chinese clothes, eyelashes, facial mark, feixianji (hairstyle), flower, food, forehead mark, fruit, grin, hagoromo, hair flower, hair ornament, hair rings, hand up, hanfu, holding, holding food, holding fruit, huadian, jewelry, looking at viewer, necklace, official alternate costume, parted bangs, peach, pink flower, purple flower, purple hanfu, shawl, sidelocks, smile, solo, upper body, white background, white shawl, wide sleeves
  ```
- **四手妈妈**
  ```text
  rating:sensitive,artist:xoxzxox, 0.54::lin_qing_\(phosphorus_1104\)::, 0.78::konya_karasue::, 1.28::urabe_michiru::, 1.17::niukou_kouzi::, 1.16::shycocoa::,colorful, vibrant colors,tidy,sidelight,light and shadow,chiaroscuro,intense shadow, 1.1::(lens flare:1.2::), -2::artist collaboration::, motion blur::, dynamic pose, foreshortening, , {{realistic,photorealistic,no text,ultra-detailed,8k,}},-3::thick outlines::,{{{purple light,backlight,soft backlighting}}},golden hour glow,no text,text:k.ono text
  ```
- **葬花吟**
  ```text
  Norice 1girl,,frieren,,::,,__artist__, ,(sideways glance:1.20), (close-up:0.80),,profile, from above, looking ahead,,jewelry, green eyes, capelet, twintails, long hair, parted bangs, white hair, small breasts, earrings,,bodysuit, plugsuit,,analogous colors,,red theme, orange theme, flower, orange flower, red flower, floral background, white theme, surreal, leaf, plant, dappled sunlight, shade, , very awa, newest, {{{yoneyama_mai}}},{artist_ciloranko},zhibuji_loom,[[[fuzichoco]]],{{rella,konya_karasue}},{hagimorijia},wlop,, location
  ```
- **花火**
  ```text
  (good quality, newest, ultra detailed, best anatomy, HDR, 8K, high detail RAW color art, high contrast), ultra-high resolution,32K UHD,sharp focus, Visual impact,(Visual impact:1.2),(Electromotive force:1.2),(perspective composition:1.2),(A shot with tension:1.3), ganyu (genshin impact),horn,blue hair, aerial fireworks, braid, closed-up,close shot,from above,dutch angle,cowboy shot, fireworks, floral print, floral print kimono,long hair, looking at viewer, night, night sky, obi, purple sash, hair flower,sash, sky, solo, standing, star (sky), starry sky, Turn around and reach out to the audience.purple flower,looking at viewer {Stunning composition},[torino_aqua], artist:yoneyama_mai,artist:miv4t, fajyobore, skyrick9413,(lens flare:1.2),{{{yumenouchi chiharu}}},mochizuki_kei ,[[[[[[rei_(sanbonzakura)]]]]],[artist:rei (sanbonzakura)],artist:dino_(dinoartforame),colorful, vibrant colors,tidy,white light,sidelight,light and shadow,chiaroscuro,intense shadow, 1.2::(lens flare:1.2::), location
  ```
- **荧河** `nsfw?`
  ```text
  nsfw,quan \(kurisu tina\), alternates custom,realistic and detailed texture,1.1::photo screencap::,1.1::realistic coloring::,1.4::photograph::,{{artist:maximalism}},{{artist:hong_(white_spider)}},[artist:onineko],{{artist:tab_head}},[[artist:quasarcake]],{artist:rin_yuu},{{artist:kim_eb}}, {{artist:hito_komoru}},{{artist:tokkyu}},{artist:douya(233)},{artist:ogipote}, artist:iizuki_tasuku,{{artist:ke-ta}}, {artist:watao}, {{{artist:nixeu}}},year2024,1.5::high contrast, colorful, detailed light, cinematic lighting, lens flare, light leaks::,{shiny skin},best shadow,dynamic angle,photograph,photo background,The image depicts a serene nighttime scene with a girl standing by a glowing pond. She is facing away from the viewer, looking up at the starry sky, which is filled with shooting stars. The girl has long hair and is wearing a dress. The pond emits a soft, blue light, creating a magical atmosphere. The background features silhouetted trees and a dark, starry sky. The overall scene is tranquil and mystical, with a focus on the interplay of light and the night sky.
  ```
- **着相**
  ```text
  artist:miv4t, [[[artist:quasarcake]]],artist:fajyobore ,[[[[[artist:skyrick9413]]]]],[[ask_(askzy)]],rella, [konya karasue::15], (z3zz4:0.6), <lora:KonyaKarasue-000008:.15>, 1girl, solo, wakaba mutsumi, expressionless, see-through sleeves, frills, capelet, green hair, holding picture frame, yellow eyes, dark red headwear, beret, black dress, black pantyhose, skirt, shirt, jewelry, white_ascot, brooch, drop earring, black earrings, , gold trim, straight_hair, white_eyelashes, upper body, sitting, armchair, straight-on, dark theme, on stage, red curtains, <lora:wakabamutsumi2v2_obaiv1:.7>, very awa, newest, rating:general
  ```
- **游戏时间**
  ```text
  (good quality, newest, ultra detailed, best anatomy, HDR, 8K, high detail RAW color art, high contrast), ultra-high resolution,32K UHD,sharp focus, Visual impact,(Visual impact:1.2),(Electromotive force:1.2),(perspective composition:1.2),(A shot with tension:1.3), ganyu \\(genshin impact\\), 1girl, solo, long hair, blush, smile, open mouth, bangs, skirt, shirt, holding, hair between eyes, school uniform, blue hair, purple eyes, white shirt, ahoge, short sleeves, :d, sidelocks, pleated skirt, lying, horns, barefoot, serafuku, alternate costume, artist name, indoors, sailor collar, twitter username, blurry, pillow, symbol-shaped pupils, window, sparkle, on stomach, curtains, couch, + +, contemporary, controller, game controller, playing games, sparkling eyes, game console, holding controller, gamepad, playstation controller, {Stunning composition}, artist:yoneyama_mai,artist:miv4t, fajyobore, skyrick9413,(lens flare:1.2),{{{yumenouchi chiharu}}},mochizuki_kei ,[[[[[[rei_(sanbonzakura)]]]]],[artist:rei (sanbonzakura)],artist:dino_(dinoartforame),colorful, vibrant colors,tidy,white light,sidelight,light and shadow,chiaroscuro,intense shadow, 1.2::(lens flare:1.2::)
  ```
- **双生**
  ```text
  2girls, multiple girls, hoshimi miyabi,tsukishiro yanagi,breasts, animal ears, large breasts, long hair, braid, adjusting eyewear, profile, fox ears, parted lips, blunt bangs, french braid, hair between eyes, sidelocks, expressionless, hime cut, cat ears, black hair, half updo, serious, wing collar, glasses, necktie, shirt, gloves, collared shirt, earrings, jacket, long sleeves, hair ornament, underbust, round eyewear, semi-rimless eyewear, neck ribbon, hand on eyewear, corset, blazer, under-rim eyewear, dress shirt, school uniform, back-to-back, looking afar, flower, open clothes, open jacket, greyscale with colored background, cover, upper body, monochrome, blue background, from side, simple background, pink background, two-tone background, cover page, red background, aqua background, spot color, doujin cover, limited palette, greyscale, partially colored, multiple monochrome, bespectacled, copyright name, signature, english text, artist name, character name, animal ear fluff, jewelry, closed mouth, virtual youtuber, harness, chest harness, hand up, fox girl, looking ahead, black gloves, white shirt {Stunning composition},[torino_aqua], artist:yoneyama_mai,artist:miv4t, fajyobore, skyrick9413,(lens flare:1.2),{{{yumenouchi chiharu}}},mochizuki_kei ,[[[[[[rei_(sanbonzakura)]]]]],[artist:rei (sanbonzakura)],artist:dino_(dinoartforame),colorful, vibrant colors,tidy,white light,sidelight,light and shadow,chiaroscuro,intense shadow, 1.2::(lens flare:1.2::), location
  ```
- **白猫猫**
  ```text
  openvl,kemo,midori fufu,kieed,artist:reoen,machi,ningen_mame,sho_(sho_lwlw),rhasta,wlop,ke-ta,fkey,tianliang duohe fangdongye,hiten \hitenkei\,inubouzaki_(i_nu1515), original, 1girl, animal_ears, animal_hat, beanie, black_ribbon, black_shoes, candy, cat_ears, cat_girl, cat_tail, double_bun, food, grey_eyes, grey_hair, hair_bun, hat, holding, holding_candy, holding_food, holding_lollipop, knees_up, leg_warmers, lollipop, long_hair, long_sleeves, looking_at_viewer, off-shoulder_sweater, off_shoulder, open_mouth, red_nails, ribbon, ribbon_trim, shoes, sitting, solo, sweater, tail, white_hat, white_leg_warmers, y2k_fashion
  ```
- **秘奥义 - 拔葱斩！**
  ```text
  {hatsune_miku},{{battoujutsu_stance,ready to draw}},[artist:cogecha], {{artist:ciloranko}}, artist:Rella, [ask (askzy)], mignon, artist: kawacy, artist: minaba hideo, [artist:pigeon666],{{{holding spring onion, spring onion}}}, serious expression,1 girl,solo, dynamic angle,dutch angle,{{foreshortening,perspective, fisheye lens}} ,simple background, full body, squatting, on one knee
  ```
- **樱之牙**
  ```text
  (good quality, newest, ultra detailed, best anatomy, HDR, 8K, high detail RAW color art, high contrast), ultra-high resolution,32K UHD,sharp focus, Visual impact,(Visual impact:1.2),(Electromotive force:1.2),(perspective composition:1.2),(A shot with tension:1.3), , kanroji_mitsuri, 1girl, solo, long_hair, looking_at_viewer, holding, pink_hair, braid, weapon, multicolored_hair, green_hair, japanese_clothes, sword, pink_eyes, holding_weapon, mole, two-tone_hair, eyelashes, mole_under_eye, petals, gradient_hair, holding_sword, portrait, katana, hair_over_shoulder, close-up, glint, covered_mouth, haori, unsheathing, demon_slayer_uniform, multiple_moles, mole_under_each_eye {Stunning composition},[torino_aqua], artist:yoneyama_mai,artist:miv4t, fajyobore, skyrick9413,(lens flare:1.2),{{{yumenouchi chiharu}}},mochizuki_kei ,[[[[[[rei_(sanbonzakura)]]]]],[artist:rei (sanbonzakura)],artist:dino_(dinoartforame),colorful, vibrant colors,tidy,white light,sidelight,light and shadow,chiaroscuro,intense shadow, 1.2::(lens flare:1.2::), location
  ```
- **墨之影**
  ```text
  artist:kousaki ruri,[[artist:binggong_asylum]], [[[noyu_(noyu23386566)]]],[artist:starshadowmagic],artist:rella,[artist:dino_(dinoartforame)],[[as109]],[[[[rei_(sanbonzakura)]]]],artist:nixeu，{artist:dishwasher1910},miv4t,1girl,solo, star theme,lineart,monochrome,{{glitch art}},{{starry sky print}},{{space,smile,aurora,nebula}},{{cowboy shot,close-up}},sharp focus, facing viewer, water drop, floating_object,black hole,error,zoom layer, dark theme,dark heme theme,disheveled hair,{dark heme},chiaroscuro,foreshortening,red splashes,[focus on face],Glowing skin,Strong contrast,clever light and shade,Upper body,blowing wind,dynamic hair,dynamic_perspective,disheveled hair,long hair,dynamic pose,{eastern dragon},{{{{{ink wash}}}}},lineart,{{eastern dragon}},eastern dragon around the girl, location character1： girl, dusk (arknights),,colored skin,red eyes,tail,{{eastern dragon}},eastern dragon around the girl
  ```
- **娇小黍黍** `nsfw?`
  ```text
  rating:sensitive,artist:omone hokoma agm,{{character1： boy,pov,pov hand,left hand,2::one hand grabbing fumo(doll),cum drip from doll,fumo(doll),alternate face
  ```
- **JO！JO！**
  ```text
  1.5::artist:araki_hirohiko::,0.6::artist:inoue_takehiko,0.7::jojo no kimyou na bouken official art,1.3::artist:tudou_estor,::,manga cover,Golden Ratio Composition, depth of field,no text,purple revolver,full body character1： boy, guido mista
  ```
- **大炎不夜城**
  ```text
  {1girl, exusiai (arknights), alternate costume, alternate hair color, bright red hair, short hair}, ultra-detailed:1.3, artist:starshadowmagic, 0.95::artist:popqn, artist:hisona, artist:suaritesumi, artist:syhan, artist:ribiadan, artist:kitaku, artist:nakamachi machi, artist:morino hon::, 1.05::artist:10mo, artist:coyucom::, 1.1::artist:ame_usari, artist:mika_pikazo, artist:ningen_mame, artist:ciloranko, artist:sho_lwlw::, artist:ogipote, artist:tianliang_duohe_fangdongye, artist:starshadowmagic, 1.2::artist:wlop, artist:jyt, artist:anmi, artist:binggong, artist:alchemaniac, artist:shuri_(84k), artist:noyu_(noyu23386566)::, outdoors, breast cleavage, soft cheek flush, Chinese ancient beauty, dancing, starry river, Tang Dynasty imperial elegance, swirling rainbow silk sleeves, (silk gauze half sliding off shoulder:1.6), drunken gaze, (Multi-layered gauze peony-embroidered golden dress with cosmic and phoenix patterns:1.6), rainbow halo, cosmic patterns, twirling posture under moonlit pavilion, (peach blossom petals swirling:1.5), jeweled headdress with swaying tassels, snowy skin glowing, silk dance shoes, graceful arm movements, crystal-beaded waist sash flowing, enchanting smile, (liquid grace in almond eyes:1.6), moonlight through lattice windows, night-blooming epiphyllum fragrance halo, moonbeam spotlight effect, starry river flowing under feet, translucent outer robe showing inner brocade, gold thread embroidery, floating silk ribbons forming mandalas, incense smoke forming cloud patterns, -2::doll::, location, no text, -0.8::feet::, rating:general
  ```
- **林荫处**
  ```text
  {1girl, vendela (arknights), alternate costume}, 1.05::artist:10mo, artist:coyucom::, 1.1::artist:ame_usari, artist:mika_pikazo, artist:ningen_mame, artist:ciloranko, artist:sho_lwlw::, artist:ogipote, artist:tianliang_duohe_fangdongye, artist:starshadowmagic, 1.2::artist:jyt, artist:anmi, artist:binggong, artist:alchemaniac, artist:shuri_(84k), artist:noyu_(noyu23386566)::, atmospheric perspective, traditional Belarusian folk scene, young maiden in vyshyvanka blouse, pruning crimson roses in cottage garden, weaving floral wreath with trembling hands, dandelions and cornflowers at bare feet, golden sunset through birch trees, Slavonic ornamental patterns framing composition, soft focus background with wooden fence, watercolor wash effect, gentle rain of petals, (emotion: bittersweet melancholy), color palette: ivory/rust/rose/deep green
  ```
- **粽子喵**
  ```text
  1.1::artist:m2xj,::1.1::artist:doremi_(doremi4704) ::,artist:hwansang,::,1girl,shun (small) (blue archive), ::blue_archive official art,1.5::personification,::,3.6::chibi,::1.5::triangular shape,rope binding,Short arms and legs,,bamboo leaf clothes only,cosplay,（＞_＜）, location character1： rl, target#cosplay,2.0::zongzi
  ```
- **白** `nsfw?`
  ```text
  artist:yao liao wang, 1girl,solo,loli,full body,from above,from behind,facing_away,twintails,black hair,long hair,choker,wariza,white thighhighs,no shoes,on bed,soles,red backbag,school uniform
  ```
- **月下青花**
  ```text
  illyasviel von einzbern ,1girl, solo, dress, chinese clothes, long hair, breasts, hair ornament, hair flower, hand fan, white hair, holding fan, flower, twintails, holding, looking at viewer, butterfly, china dress, white dress, bare shoulders, cleavage,artist:misyune,{artist:azuuru},{artist:torino aqua}, red eyes, side slit, bangs, very long hair, blue nails, cloud, floral print, blue floral print,moon, nail polish, sky, medium breasts, off shoulder, thighs, blush, branch, tassel, wide sleeves, detached collar, clothing cutout, cleavage cutout, sleeveless, sleeveless dress, feet out of frame, standing,{},{artist:fuzichoco},artist:kedama milk,artist:chen bin, {artist:atdan},artist:hito,artist:hiten,{artist:mignon}, rating:general, simple backgrounbelletext
  ```
- **HIINAA KINGDOM**
  ```text
  hina (blue archive) ,hina (dress) (blue archive) ,1girl, back, back focus, bare back, bare shoulders, bead necklace, beads, black halo, black horns, black wings, {{dio brando's pose \(jojo\)}}, dress, earrings, elbow gloves, from behind, gloves, halo, horns, jewelry, jojo pose,artist:misyune,{artist:azuuru},{artist:torino aqua}, lips, looking at viewer, necklace, official alternate costume, parted lips, purple dress, purple eyes, purple gloves, simple background, solo, white background, white hair, wings,{},{artist:fuzichoco},artist:kedama milk,artist:chen bin, {artist:atdan},artist:hito,artist:hiten,{artist:mignon}, rating:general
  ```
- **水母头人鱼** `nsfw?`
  ```text
  ningen_mame,onineko, artist:akizero1510,artist:wanke, [[artist:akakura]], 1.15::::,-5::artist collaboration::,-2::simple illustration::, 1girl, solo,mermaid, white hair, breasts, tentacles, monster girl, navel, simple background, short hair, red eyes, full body, small breasts, looking at viewer, closed mouth, pasties, pink hair, pink eyes, jellyfish, living clothes, medium breasts, expressionless, hair between eyes, medium hair, black gloves, colored skin, nude, floating, gradient background, bright pupils, dutch angle, gloves, personification, multicolored hair, tail, white background, stomach, hat, sketch, black background, monster, elbow gloves, blush, revealing clothes, red hair
  ```
- **小青**
  ```text
  [guodong buguoqiu:0.7], [Say HANa:0.4], [arutera:0.4], 1girl, animal on head, animal on shoulder, bead bracelet, beads, black hair, blunt bangs, bracelet, braid, braided bun, branch, chinese zodiac, colored inner hair, double bun, earrings, floral print, floral print kimono, flower, folding fan, gem, green eyes, green nails, hair branch, hair bun, hand fan, hand on own face, head tilt, holding, holding fan, japanese clothes, jewelry, kimono, lips, looking at viewer, multicolored hair, multiple braids, nail art, nail polish, on head, patterned hair, pearl \(gemstone\), pearl earrings, pearl ring, print kimono, ring, snake, snake on head, snake on shoulder, snake print, tassel, upper body, white flower, white hair, white kimono, white theme, year of the snake
  ```
- **水中仙**
  ```text
  [guodong buguoqiu:0.7], [Say HANa:0.4], [arutera:0.4], 1girl, from above, from side, contrapposto, prism light, dancing on the ocean, lotus, realistic crystal, ultra detailed crystal, character illustration,water, black background
  ```
- **树龙**
  ```text
  ningen_mame,onineko, artist:akizero1510,artist:wanke, [[artist:akakura]], 1.15::::,-5::artist collaboration::,-2::simple illustration::, 1girl, black hair, long hair, sitting, skirt, black footwear, gloves, plant, dragon, lantern, black gloves, solo, black skirt, looking at viewer, white background, shoes, tree, yellow eyes, shirt, orange eyes, full body, holding, cup, potted plant, long skirt, long sleeves, bug, roots, horns, vines, very long hair, coat, pantyhose, closed mouth, simple background, white coat, white shirt, eastern dragon, table, open clothes, sidelocks, pointy ears, teeth, jewelry, leaf, candle, jar, moss, blunt bangs, branch, glowing, overgrown, white jacket
  ```
- **水晶森林**
  ```text
  [guodong buguoqiu:0.7],[Say HANa:0.4],[arutera:0.4], 1girl, cowboy shot),(slender body, fragile-looking limbs, ethereal presence),(sheer long dress with layered translucent fabric, shimmering pastel tones, glowing scale-like accents),(long wavy silver hair, drifting as if weightless, adorned with crystal flower ornaments),(soft vacant stare, faint melancholic smile, floating slightly above the ground),(ancient dragon shrine in a misty glade, stone pillars entwined with ivy, glowing runes, moonlight through the trees),(dreamlike lighting, bluish hues, magical atmosphere, floating motes of light)
  ```
- **曲绘模板-KING**
  ```text
  ningen_mame,onineko, artist:akizero1510,artist:wanke, [[artist:akakura]],king (vocaloid), cape, crown, finger in own mouth, fur-trimmed cape, fur trim, gloves, holding, holding crown, limited palette, mouth pull, simple background, sitting on throne, solo, unworn crown, throne, white gloves character1： white hair, blue eyes, gradient eyes, wolf ears, wolf tail, wolf girl, chained, leash, viewer holding leash
  ```
- **曲绘模板-再见宣言**
  ```text
  priestess (arknights)，ningen_mame,onineko, artist:akizero1510,artist:wanke, [[artist:akakura]],goodbye sengen (vocaloid), 1girl, arms up, closed mouth, looking at viewer, ok sign, simple background, smile, solo, upper body, v, yellow background
  ```
- **一米阳光**
  ```text
  [guodong buguoqiu:0.7], [Say HANa:0.4], [arutera:0.4], 1girl, absurdly detailed composition, collar, double-parted bangs, dress, eyelashes, flower, frilled shirt collar, frills, grey flower, hair between eyes, hair ornament, lace, lace dress, lily \(flower\), long hair, long sleeves, looking at viewer, ornate clothes, see-through clothes, see-through dress, solo, very long hair, white collar, white dress, yellow eyes, wide_sleeves,wariza
  ```
- **兔子玛丽** `nsfw?`
  ```text
  minimalism,{faceless}, no eyes,portrait,{(no_lineart)}, simple_background,black_background,(blending),(flat color),limited palette, white skin, high_contrast,{{{{{ artist: ukai_saki, artist: rei_(sanbonzakura), artist: void_0, [[artist: deadprince]] ::, artist: yoneyama mai,1girl, black hair, low twintails, playboy bunny, black leotard, fake animal ears, rabbit ears, rabbit tails,red lips, see-through leotard, navel, center see-through, revealing clothes,shrug (clothing), crop top, black sleeves, long sleeves, cup, animal ears, rabbit ears, bow, bowtie, drinking glass, black bowtie, black bow, medium breasts, plate, wine glass, looking at viewer, holding, red nails, alcohol, nail polish, rabbit, english text, black background, smile
  ```
- **物化魔法**
  ```text
  azusa (blue archive), chibi,chibi only,{{{{{objectification}}}}}}, no humans, slime_(creature), :<,angel_wings
  ```
- **狐耳蘑菇帽**
  ```text
  ningen_mame,onineko, artist:akizero1510,artist:wanke, [[artist:akakura]], 1.15::::,-5::artist collaboration::,-2::simple illustration::, 1girl,solo, full body, white background, pink hair,pink tail, {pink mushroom hat},{fox ear hat},star-shaped_pupils,light green eyes,white pupils,cross-shaped hair ornament,flowers,fox tail, revealing clothes, swimsuit, no coat
  ```
- **四手妈妈** `nsfw?`
  ```text
  rating:sensitive,artist:xoxzxox, 0.54::lin_qing_\(phosphorus_1104\)::, 0.78::konya_karasue::, 1.28::urabe_michiru::, 1.17::niukou_kouzi::, 1.16::shycocoa::,colorful, vibrant colors,tidy,sidelight,light and shadow,chiaroscuro,intense shadow, 1.1::(lens flare:1.2::), -2::artist collaboration::, motion blur::, dynamic pose, nsfw,convenient censoring, {{realistic,photorealistic,no text,ultra-detailed,8k,}},-3::thick outlines::,{{{purple light,backlight,soft backlighting}}},golden hour glow,no text,text:k.ono text character1： noirl, arknights, raidian \(arknights\), girl, black gloves, black jacket, breasts, brown shirt, cowboy shot, electric plug, extra arms, flower, gloves, grey eyes, hair between eyes, hair flower, hair intakes, hair ornament, heart, heart hands, jacket, long sleeves, looking at viewer, medium breasts, mole, mole under eye, one eye closed, open clothes, open jacket, own hands together, parted lips, pink flower, pink gloves, pink rose, rose, shirt, short hair, skin tight, smile, solo, standing, white hair
  ```
- **舞娘** `nsfw?`
  ```text
  nsfw,realistic,omone hokama agm,quasarcake,sho_(sho_lwlw),as109,reoen,wanke,1::age fx::, 1.15::::,-5::artist collaboration::,-6::simple illustration::, kisaki (blue archive), alternate costume, 1girl, cinematic_angle,macro photography,hand focus,looking away,1girl 1.5::arabesque_(pose):: standing_on_one_leg bangle bare_shoulders bracelet breasts brown_hair chinese_clothes dancer detached_sleeves dunhuang_style earrings frilled_shawl frills hagoromo harem_outfit jewelry long_hair lotus_hair_ornament neck_ring shawl solo stomach simple_background,bare back
  ```
- **开曼与饺子**
  ```text
  rating:sensitive,artist:omone hokoma agm,sushispin, 0.8::nana_mikoto::, 0.9::ohisashiburi::,ru zhai,artist:yoneyama_mai,artist:miv4t, fajyobore, skyrick9413,(lens flare:1.2),{{{yumenouchi chiharu}}},mochizuki_kei ,[[[[[[rei_(sanbonzakura)]]]]],[artist:rei (sanbonzakura)],artist:dino_(dinoartforame),colorful, vibrant colors,tidy,white light,sidelight,light and shadow,chiaroscuro,intense shadow, 1.2::(lens flare:1.2::), -2::artist collaboration::, {{realistic,photorealistic,no text,ultra-detailed,8k,}},-3::thick outlines::,{{{purple light,backlight,soft backlighting}}},golden hour glow, character1： plastiboo, dorohedoro, caiman \(dorohedoro\), chidaruma, nikaidou \(dorohedoro\), boy, chopsticks, cross, cross facial mark, demon, demon girl, dumpling, facial mark, food, gas mask, gloves, head spikes, heart, heart-shaped pupils, jiaozi, male focus, mask, sharp teeth, skull, skull head, smile, steaming food, symbol-shaped pupils, teeth
  ```
- **恶魔二阶堂**
  ```text
  rating:sensitive,artist:omone hokoma agm,sushispin, 0.8::nana_mikoto::, 0.9::ohisashiburi::,ru zhai,artist:yoneyama_mai,artist:miv4t, fajyobore, skyrick9413,(lens flare:1.2),[artist:rei (sanbonzakura)],artist:dino_(dinoartforame),colorful, vibrant colors,tidy,white light,sidelight,light and shadow,chiaroscuro,intense shadow, 1.2::(lens flare:1.2::), -2::artist collaboration::, {{realistic,photorealistic,no text,ultra-detailed,8k,}},-3::thick outlines::,{{{purple light,backlight,soft backlighting}}},golden hour glow, character1： ibumuc, dorohedoro, one piece, nikaidou \(dorohedoro\), girl, apron, artist name, boots, breasts, chaps, covering own eyes, crotchless, crotchless pants, demon girl, demon horns, demon tail, detached sleeves, elbow gloves, gear fifth, gloves, greyscale, hand on own stomach, horns, large breasts, long hair, long sleeves, mittens, monochrome, name connection, open mouth, outline, outside border, pants, ponytail, power connection, scene reference, sideboob, signature, smile, solo, sternocleidomastoid muscle, tail, teeth, upper teeth only, white outline
  ```
- **烟花会前**
  ```text
  plana \(blue archive\),[[[artist:betabeet]]],[[artist:yoneyama_mai]],1girl,close-up,1girl, alternate hairstyle, black choker, black jacket, black ribbon, black sailor collar, black serafuku, black shirt, black skirt, blush, braid, choker, closed mouth, colored inner hair, double v, flat chest, grey eyes, grey hair, hair ribbon, halo, jacket, looking at viewer, multicolored hair, neckerchief, pink hair, pink halo, ribbon, sailor collar, school uniform, serafuku, shirt, single braid, skirt, solo, twintails, two-tone hair, v, white neckerchief,lens flare,cinematic_lighting,lighting,photo background, blurry background, top aesthetic, no text
  ```
- **烟**
  ```text
  rating:sensitive,artist:omone hokoma agm,sushispin, 0.8::nana_mikoto::, 0.9::ohisashiburi::,ru zhai,artist:yoneyama_mai,artist:miv4t, fajyobore, skyrick9413,(lens flare:1.2),[artist:rei (sanbonzakura)],artist:dino_(dinoartforame),colorful, vibrant colors,tidy,white light,sidelight,light and shadow,chiaroscuro,intense shadow, 1.2::(lens flare:1.2::), -2::artist collaboration::, {{realistic,photorealistic,no text,ultra-detailed,8k,}},-3::thick outlines::,{{{purple light,backlight,soft backlighting}}},golden hour glow, character1： boy, en \(dorohedoro\),row \(akatuki\), portrait, close-up,q. hayashida, dorohedoro, en \(dorohedoro\), kikurage \(dorohedoro\), black undershirt, boots, evil eyes, fur-trimmed jacket, fur trim, glaring, jacket, jewelry, mask, mouth mask, mushroom, pants, red boots, red hair, red jacket, red pants, ring, sitting, spiked hair
  ```
- **后夜祭**
  ```text
  kazusa \(band\) \(blue archive\),[[[artist:betabeet]]],[[artist:yoneyama_mai]],close-up,1girl, alternate costume, between legs, black gloves, black kimono, blurry, blush, closed mouth, depth of field, fur shawl, gloves, half gloves, hand between legs, holding candy apple, japanese clothes, kimono, legs together, long sleeves, shawl, sitting, solo, wide sleeves,from side,lens flare,cinematic_lighting,lighting,photo background, blurry background, top aesthetic, no text
  ```
- **今夜、あなたとだけ**
  ```text
  mutsuki \(dress\) \(blue archive\),[[[artist:betabeet]]],[[artist:yoneyama_mai]],1girl,close-up, bare shoulders, black bow, black choker, black hairband, bow, breasts, choker, closed mouth, cocktail glass, cup, dress, drink, drinking glass, fishnet pantyhose, fishnets, fur shawl, grey hair, hair bow, hairband, holding, holding drink, official alternate costume, official alternate hairstyle, pantyhose, pointy ears, purple eyes, red dress, shawl, small breasts, smile, solo,lens flare,cinematic_lighting,lighting,photo background, blurry background, top aesthetic, no text, character1： boy, en \(dorohedoro\),row \(akatuki\), portrait, close-up,q. hayashida, dorohedoro, en \(dorohedoro\), kikurage \(dorohedoro\), black undershirt, boots, evil eyes, fur-trimmed jacket, fur trim, glaring, jacket, jewelry, mask, mouth mask, mushroom, pants, red boots, red hair, red jacket, red pants, ring, sitting, spiked hair
  ```
- **大光圈摄影**
  ```text
  hina \(dress\) \(blue archive\),[[[artist:betabeet]]],[[artist:yoneyama_mai]],1girl,from side,cherry_blossoms,upper body,lens flare,cinematic_lighting,lighting,photo background, blurry background,,half-closed eyes, top aesthetic, no text
  ```
- **仲夏** `nsfw?`
  ```text
  2::yao liao wang::, 1.5::xilmo:: ,1.1::fkey::, meinoss ,dikko ,1.1::some1else45 ::, akipeko, chuck_(harfmoondark) , miv4t，，,::,0.5::wlop::,-2::artist collaboration::,,0.7::solipsist,:: 1.1::impasto,painterly::,,,， 2girls, school uniforms, night scene, rice paddy, koi fish, flashlights, sailor collar, scenery, mysterious atmosphere Description: A mysterious and atmospheric illustration of two young women in school uniforms standing in a dark rice paddy at night. One girl kneels, shining a flashlight near a bucket, while the other stands behind her, directing her flashlight forward. Above them hovers a glowing red koi fish, adding a surreal touch to the scene. The background features a body of water, distant lights on the opposite shore, and a starless night sky, creating an eerie yet captivating mood. Their uniforms include blue sailor collars, pleated skirts, and black-framed glasses, grounding the fantastical elements in a familiar school setting.. , artist:dikko, artist:tianliang duohe fangdongye,,, fkey, betabeet，, , artist:wlop, artist:xilmo, nsfw，impasto, realistic, chiaroscuro, photorealistic,, newest,, , ,, beautiful colors,, detailed background,,, ray tracing, rating:general,rating:general, location, no ,text,-1::sketch::,-1::line art::, -0.5::monochrome::,-1::simple::,-1::broing::
  ```
- **小番茄** `nsfw?`
  ```text
  2::yao liao wang::, 1.5::xilmo:: ,1.1::fkey::, meinoss ,dikko ,1.1::some1else45 ::, akipeko, chuck_(harfmoondark) , miv4t，，,::,0.5::wlop::,-2::artist collaboration::,,0.7::solipsist,:: 1.1::impasto,painterly::,,,， 2girls, amate yuzuriha, nyaan (gundam gquuuuuux), black hair, red hair, green shirt, blue pants, white off-shoulder shirt, denim shorts, barefoot, sitting, playful scene, indoors, chair, disco ball, fishbowl, cluttered room Natural Language Description: In a vibrant and cozy room, Amate Yuzuriha with her long black hair and yellow eyes sits perched on a chair, visibly surprised and lifting her feet in reaction to something. Opposite her, Nyaan with short red hair and green eyes kneels on the floor wearing a casual white off-shoulder shirt and denim shorts, intently examining or playfully touching Amate's foot. The room is filled with charming details including a disco ball hanging from the ceiling, a fishbowl with a goldfish, books, and a colorful rug on the wooden floor, creating a warm and lively atmosphere. , artist:dikko, artist:tianliang duohe fangdongye,,, fkey, betabeet，, , artist:wlop, artist:xilmo, nsfw，impasto, realistic, chiaroscuro, photorealistic,, newest,, , ,, beautiful colors,, detailed background,,, ray tracing, better quality, Cinematic Lighting, cinematic angle, rating:general, location, no text, -0.8::feet::, rating:general
  ```
- **怒灵**
  ```text
  2::yao liao wang::, 1.5::xilmo:: ,1.1::fkey::, meinoss ,dikko ,1.1::some1else45 ::, akipeko, chuck_(harfmoondark) , miv4t，，,::,0.5::wlop::,-2::artist collaboration::,,0.7::solipsist,:: 1.1::impasto,painterly::,,,2girls, multiple girls, yuri, fire, burning, dress, Character 1: brown hair, updo, hair bun, single hair bun, closed eyes, profile, dark skin, black dress, long dress. Character 2: white hair, short hair, sketch. A dark-skinned woman in a dark period dress gently cups the face of a ghostly, white-outlined figure. The woman's expression is tender and serene, her eyes closed as if in a trance. Strong, warm backlighting from below casts a fiery glow on her back and the train of her dress, suggesting flames. This light contrasts dramatically with the cool, dark blue background, creating a powerful, emotionally charged scene. The mood is both intimate and melancholic. .-1::ai-generated, ai-assisted, :: ,-1::unfinished::， chiaroscuro cinematic angle,，location
  ```
- **龙返夜**
  ```text
  2::yao liao wang::, 1.5::xilmo:: ,1.1::fkey::, meinoss ,dikko ,1.1::some1else45 ::, akipeko, chuck_(harfmoondark) , miv4t，，,::,0.5::wlop::,-2::artist collaboration::,,0.7::solipsist,:: 1.1::impasto,painterly::,,,landscape,Chinese festival,lantern,fireworks, dragon,wide_shot,moon,house, .-1::ai-generated, ai-assisted, :: ,-1::unfinished::， chiaroscuro cinematic angle,，location
  ```
- **呼~爽！** `nsfw?`
  ```text
  2::yao liao wang::, 1.5::xilmo:: ,1.1::fkey::, meinoss ,dikko ,1.1::some1else45 ::, akipeko, chuck_(harfmoondark) , miv4t，，,::,0.5::wlop::,-2::artist collaboration::,,0.7::solipsist,:: ,,, nsfw, 1.1::impasto,painterly::,,,1girl, chair, closed eyes, electric fan, flip-flops, kitchen, open mouth, plant, potted plant, sandals, solo, summer a girl captured in a dynamic pose, likely yawning or shouting with her mouth wide open and eyes closed, suggesting a moment of exhaustion . Her hair appears windswept, possibly from the electric fan visible in the foreground to the left, hinting at a warm summer day. She is seated on a red plastic chair, wearing a light-colored top, dark shorts, and pink flip-flops. The setting appears to be a kitchen or a casual indoor space, with a counter, some dishes including a bowl of green vegetables, and a yellow crate with indistinct text in the background. A potted plant in the blurry foreground adds depth to the scene. The overall lighting suggests daylight filtering in, creating a somewhat muted yet vibrant atmosphere. .-1::ai-generated, ai-assisted, :: ,-1::unfinished::， chiaroscuro cinematic angle,，location
  ```
- **一路向北** `nsfw?`
  ```text
  mafuyu (chibi21)},{{rurudo,,hiro (dismaless),,yoneyama mai,mikami mika}},, ,[[[[surreal,,rella,,,,tokyogenso,mocha_(cotton),, [[void_0,konya_karasue,,]], wlop , hiten_(hitenkei),qys3,tyouya,, ]]]], solo,,full body,close-up,hatsune miku, hair ornament, ,hair ribbon,green hair,long hair,collared shirt,white shirt,,green necktie,{driving,], a cinematic scene of a person driving a convertible sports car at night on the highway, dramatic lighting casting shadows and highlights on the face, expressionless, wind blowing through hair, neon lights and car headlights reflecting on the face, glowing road markings, motion blur in the background, side view from passenger seat or front low angle, ultra-detailed, high contrast, film noir atmosphere, dynamic composition, 4k , ,detailed eyes,,,newest,nsfw,,detailed eyes,best eyes,,-2::multiple views,:: ,,shiny skin
  ```
- **微醺** `nsfw?`
  ```text
  2::yao liao wang::, 1.5::xilmo:: ,1.1::fkey::, meinoss ,dikko ,1.1::some1else45 ::, akipeko, chuck_(harfmoondark) , miv4t，，,::,0.5::wlop::,-2::artist collaboration::,,0.7::solipsist,:: 1.1::impasto,painterly::,,,， 1girl, Misaki (Blue Archive), solo, sitting, from front, Character 1: brown hair, short hair, purple eyes, blush, open mouth, bare shoulders, black bra, bra, black panties, panties, underwear, navel, stomach, black choker, choker, earrings, stud earrings, jewelry, grey shirt, shirt (draped), halo, pink halo, holding cigarette, cigarette, holding cup, cup, alcohol. Misaki from Blue Archive is depicted sitting solo in a kitchen setting, directly looking at the viewer. She has short brown hair, purple eyes, and a slight blush on her face, with her mouth slightly open. She wears a black bra and black panties, with a grey shirt loosely draped over her shoulders, exposing her bare shoulders and stomach with a visible navel. A black choker and stud earrings complete her look. She is holding a lit cigarette in one hand and a cup of alcohol in the other. A glowing pink halo appears above her head. The background shows a kitchen sink, a microwave, and kitchen utensils hanging, all bathed in a cool, soft light, suggesting a tranquil, introspective moment. , ,, beautiful colors,, detailed background,,, ray tracing, better quality, Cinematic Lighting, cinematic angle, rating:general, location, no text, -0.8::feet::, rating:general
  ```
- **放课后**
  ```text
  2::yao liao wang::, 1.5::xilmo:: ,1.1::fkey::, meinoss ,dikko ,1.1::some1else45 ::, akipeko, chuck_(harfmoondark) , miv4t，，,::,0.5::wlop::,-2::artist collaboration::,,0.7::solipsist,:: 1.1::impasto,painterly::,,,，, 2girls, multiple girls, yuri, kiss, school uniform, sitting, Characters: Yoroizuka Mizore: long black hair, wearing Kitauji High School uniform (blue sailor collar, white shirt, blue skirt, white socks), holding partner's face, Kasaki Nozomi: black hair in short ponytail, wearing same uniform, being embraced, Setting: near window, soft blue lighting, intimate atmosphere, [Natural Language Supplement]: This tender yuri artwork captures a romantic moment between Yoroizuka Mizore and Kasaki Nozomi from "Hibike! Euphonium" in their school uniforms. Mizore, with her long black hair flowing, gently cradles Nozomi's face in her hands as they sit near a window bathed in soft blue light. Nozomi, her black hair tied in a short ponytail, leans into the embrace as their lips meet in a passionate french kiss. Both wear Kitauji High's distinctive uniform - white shirts with blue sailor collars and neckerchiefs, blue pleated skirts, and white socks. The composition beautifully conveys the depth of their relationship through the intimate gesture and the warm, muted color palette that envelops the scene.. -1::ai-generated, ai-assisted, :: ,-1::unfinished::， cinematic angle,，location
  ```
- **孤独摇滚（？）**
  ```text
  wada_arco,full color, 1girl,kita ikuyo,ciaccona \(wuthering waves\)(cosplay),concentrating, guitar, holding, holding guitar, holding instrument, instrument, music, playing instrument, sweat,Upper body,close up
  ```
- **天降未来！**
  ```text
  2::yao liao wang::, 1.5::xilmo:: ,1.1::fkey::, meinoss ,dikko ,1.1::some1else45 ::, akipeko, chuck_(harfmoondark) , miv4t，，,::,0.5::wlop::,-2::artist collaboration::,,0.7::solipsist,:: 1.1::impasto,painterly::,,,Vocaloid, Hatsune Miku, 1girl, 1other, blue eyes, blue hair, blue sky, bow, day, falling, hair bow, holding hands, long hair, looking at viewer, midair, multiple hair bows, open mouth, pov, pov hands, red bow, short sleeves, sky, smile, twintails, very long hair, from below, wide shotCharacter 1: Hatsune Miku, blue eyes, very long blue twintails, smiling, open mouth, looking at viewer, falling, midair, wearing white short-sleeved top with red bows, holding hands, central.Character 2: 1other, pov hands, reaching out, on the bottom left.[Natural Language Supplement]：The image captures Hatsune Miku mid-fall against a vast blue sky, viewed from a wide-angle, slightly from below. She wears a cheerful smile, looking directly at the viewer as she reaches for a hand from the foreground (POV hands). Her exceptionally long blue twintails stream dynamically around her, accented by multiple red bows. Below her, a sprawling landscape of green hills and blue ocean stretches into the distance, with small white clouds dotting the horizon. The bright daylight bathes the scene in vibrant blues and greens. .-1::ai-generated, ai-assisted, :: ,-1::unfinished::， chiaroscuro cinematic angle,，location
  ```
- **梦之森**
  ```text
  2::yao liao wang::, 1.5::xilmo:: ,1.1::fkey::, meinoss ,dikko ,1.1::some1else45 ::, akipeko, chuck_(harfmoondark) , miv4t，，,::,0.5::wlop::,-2::artist collaboration::,,0.7::solipsist,:: 1.1::impasto,painterly::,,,1girl, solo, outdoors, garden, swing, day, full body, low angle, school uniform, analogous colors, Character 1: long dark hair, blue eyes, open mouth, smile, :d, blush, looking at viewer, swinging on swing, yellow shirt, blue skirt, white socks, loafers. [Natural Language Supplement]： A girl in a school uniform is captured mid-swing, her expression one of pure joy. From a dynamic low angle, she looks down at the viewer with a wide, open-mouthed smile. The entire scene is drenched in a vibrant, stylized yellow-green light, creating a warm and energetic atmosphere. Behind her are lush green bushes with pink flowers, while dandelions dot the foreground. The strong sunlight filters through, highlighting her form against the shaded background. .-1::ai-generated, ai-assisted, :: ,-1::unfinished::， chiaroscuro cinematic angle,，location
  ```
- **并非细品**
  ```text
  artist:omone hokoma agm,0.8::nana_mikoto::, 0.9::ohisashiburi::,ru zhai, -2::artist collaboration::, 1girl,white hair,red eyes,foot focus,[],foreshortening, in room,on bed,feet,pajamas, white pantyhose, soles,toes, foot focus,solo,long hair
  ```
- **白花冠** `nsfw?`
  ```text
  2::yao liao wang::, 1.5::xilmo:: ,1.1::fkey::, meinoss ,dikko ,1.1::some1else45 ::, akipeko, chuck_(harfmoondark) , miv4t，，,::,0.5::wlop::,-2::artist collaboration::,,0.7::solipsist,:: 1.1::impasto,painterly::,,,， Cinematic Lighting, nsfw, ,-2.5::artist collaboration::, 1.1::impasto,painterly::,,,2girls, yuri, outdoors, day, on grass, lying, on back, on side, face-to-face, eye contact, looking at another, brown hair, parted lips, dress, white dress, victorian, puffy sleeves, juliet sleeves, long sleeves, hat, flower, holding, holding umbrella, umbrella, lace-trimmed umbrella, grass, bush, Two girls are depicted lying face-to-face in a grassy outdoor setting, possibly in a field or park, during the day. One girl, with brown hair, is lying on her back, looking at the other. The second girl, also with brown hair, is lying on her side, wearing a hat adorned with flowers, and holding a lace-trimmed umbrella over them. Both are dressed in white Victorian-style dresses with puffy sleeves. The ground is covered in green grass with small yellow and white flowers, and lush green bushes are visible in the background. The artist's name is subtly integrated into the bottom of the image. .-1::ai-generated, ai-assisted, :: ,-1::unfinished::， chiaroscuro cinematic angle,，location
  ```
- **彷徨** `nsfw?`
  ```text
  2::yao liao wang::, 1.5::xilmo:: ,1.1::fkey::, meinoss ,dikko ,1.1::some1else45 ::, akipeko, chuck_(harfmoondark) , miv4t，，,::,0.5::wlop::,-2::artist collaboration::,,0.7::solipsist,:: 1.1::impasto,painterly::,,,1girl, solo, the ring, horror, night, close-up, from behind, indoors, dynamic motion, Character: Yamamura Sadako, cute face, beautiful detailed eyes, long black hair, flowing hair, motion blur, pale skin, looking back over shoulder, crying, tears, source#straining to move, crawling, pushing, reaching, torn white dress, barefoot, dirty feet, soles, slim, small breasts, bound legs, rope bondage, Background: dark room, old television in background, static screen, blue glow, wooden floor, blurred foreground, dramatic shadows, strong backlight. Captured from behind, Sadako's form is a blur of desperate motion. Her body is contorted, one arm powerfully pushing against the dark wooden floor, the other reaching frantically towards the blue-glowing television. Tears stream from her cute, wide eyes as she throws a pained look back. Her long hair trails behind, emphasizing the raw effort of her crawl. Dirty soles of her bare feet show, straining against the rope binding them. .-1::ai-generated, ai-assisted, :: ,-1::unfinished::， chiaroscuro cinematic angle,，location
  ```
- **美人鱼**
  ```text
  artist:omone hokoma agm,0.8::nana_mikoto::, 0.9::ohisashiburi::,ru zhai, -2::artist collaboration::, 1girl,white hair,red eyes,,year_2023,,[[]],[[[]]],,[],[[]],[[[]]],[[[]]],henreader,mermaid, underwater, navel, monster_girl, open_mouth,smile, cleavage,, twintails, :d, looking_at_viewer, petals, air_bubble, bubble, detached_sleeves, jewelry,hair_ornament, flower, earrings, bare_shoulders
  ```
- **薄纱裤袜**
  ```text
  2::yao liao wang::, 1.5::xilmo:: ,1.1::fkey::, meinoss ,dikko ,1.1::some1else45 ::, akipeko, chuck_(harfmoondark) 3::5toes::,toes,foot_focus,white dress,white garter belt,white headwear,1girl,solo,from below,foot focus,sitting,crossed legs,looking down,looking at viewer,1.2::tea,pouring,pouring tea on to feet::, cinematic angle,，location
  ```
- **寂静**
  ```text
  2::yao liao wang::, 1.5::xilmo:: ,1.1::fkey::, meinoss ,dikko ,1.1::some1else45 ::, akipeko, chuck_(harfmoondark) , miv4t，，,::,0.5::wlop::,-2::artist collaboration::,,0.7::solipsist,::， 1.1::impasto,painterly::,,,1girl, solo, Chainsaw Man, Reze (Chainsaw Man), medium shot, looking at viewer, partially submerged, wet, black hair, green eyes, smile, closed mouth, black choker, hands up, water, pool. Reze from Chainsaw Man is depicted in a medium shot, partially submerged in a body of water, likely a pool. She has wet, dark hair and striking green eyes that meet the viewer's gaze with a subtle, closed-mouth smile. She wears a black choker around her neck. Her hands are raised out of the water, palms slightly open, as if inviting interaction. The scene is bathed in cool, bluish light, creating a serene yet somewhat mysterious atmosphere, with gentle ripples on the water's surface. .-1::ai-generated, ai-assisted, :: ,-1::unfinished::， chiaroscuro cinematic angle,，location
  ```
- **无面**
  ```text
  high contrast, colorful, horror (theme), dark, darkness, gritty,artist: tsukushi akihito, artist:quasarcake, artist:dino \(dinoartforame\), artist: healthyman, chromatic aberration, film grain, artist: ssambatea, artist: chii (tsumami tsumamare),dim lighting, beautiful color (),{{realistic, (wlop:0.3), concept art}} aesthetic, 1990s \(style\),(glitch,dissolving:1.2),(muted colors:1.4),(black background:1.4),(dim lighting:1.2), (monochrome),graphite \(medium\) black background, (dark red background:1.3) (portrait,polaroid:1.5),(windy, faceless aberrations, ghost entities, black hole galaxy,river,sky,old photo:1.3) faceless, hole, hole in face, horror (theme), parody, simple background, upper body, what (itou junji:1.5),jiu niangzi,jiu niangzi \(blossom spring fairy\),1girl,chinese clothes,chinese zodiac,closed eyes,cup,dragon,eastern dragon,flower,food,from side,fruit,full body,hagoromo,hair bun,hair ornament,hanfu,holding,holding lantern,jewelry,kettle,lantern,long skirt,necklace,official alternate costume,peach,profile,purple hanfu,red flower,rock,shawl,skirt,snake,solo,weichang,white shawl,wide sleeves,yellow skirt,best illustration, colorful, realistic, dynamic angle, cinematic lighting,8::text:TANG::
  ```
- **再会**
  ```text
  2::yao liao wang::, 1.5::xilmo:: ,1.1::fkey::, meinoss ,dikko ,1.1::some1else45 ::, akipeko, chuck_(harfmoondark) , miv4t，，,::,0.5::wlop::,-2::artist collaboration::,,0.7::solipsist,:: 1.1::impasto,painterly::,,,1girl, solo, beach, water, from behind, full body, Character 1: Kirisame Marisa, blonde hair, long hair, hair bow, big hat, magician hat, white shirt, blue skirt, red bow, apron, barefoot, soles, toes, looking back, looking at viewer, expressionless. The scene captures a serene moment on a vast, watery expanse resembling a shallow beach or a mirror-like lake under an overcast sky. Kirisame Marisa, with her distinctive blonde hair, large magician hat, and iconic red bow, is depicted from behind, turning her head to look back at the viewer. She is barefoot, with subtle details of sand on her feet, standing in the shallow water that reflects the soft light of the sky. Her white shirt, blue skirt, and apron flow gently, indicating a light breeze. The overall impression is one of tranquility and subtle elegance, with the cool blues and grays of the water and sky complementing her bright and familiar attire. .-1::ai-generated, ai-assisted, :: ,-1::unfinished::， chiaroscuro cinematic angle,，location
  ```
- **霓虹视界**
  ```text
  myon_rio, 0.7::guodong buguoqiu::, 0.5::Say HANa::, 0.5::arutera::, female parkour character, neon hoodie, baggy pants, street sneakers, blue hair, cap, headphones, spray cans on belt, urban graffiti background, splashes of neon paint, vivid color scheme, (extreme perspective:1.3), (from low angle:1.2), (one-arm inverted breakdance freeze:1.3), (legs stretched in midair:1.2), (frozen in mid spin:1.3), (face looking directly at viewer:1.2), (motion blur and spray trail effects:1.3), (graffiti lighting aura:1.2)
  ```
- **fuwa fuwa** `nsfw?`
  ```text
  myon_rio, 0.7::guodong buguoqiu::, 0.5::Say HANa::, 0.5::arutera::, (soft pastel tones, watercolor, bright color, transparent, gradation), backlight,(cute girl with single braid), (dark brown hair, low-braided long hair, braid with pastel blue ribbon), light brown eyes, tareme, glasses, happy smile, open mouth,large breasts, large buttocks, voluptuous,sitting on a large soap bubble, floating in the sky, (pastel blue playboy bunny, lace decoration, frilled leotard under skirt, showgirl skirt, white thighhighs, with blue ribbon decoration, hairband with pastel blue bunny ears),clearly blue sky, soap bubbles, morning sunshine, soft lighting, light particles, sparkles
  ```
- **流萤穿丝中**
  ```text
  firefly (honkai: star rail) ,firefly (spring missive) (honkai: star rail) ,{{putting on legwear}},white thighhighs,from side,blush,{{{{pout,embarrassed}}}},half-closed eyes,black hairband, blush, bow, bowtie,full body,foot out of frame, buttons, checkered bow, checkered bowtie, checkered clothes, checkered skirt, collared shirt, crossed legs, double-breasted, gradient eyes, green bow, green bowtie, green pupils, grey hair, grey sailor collar, grey skirt,artist:misyune,{artist:azuuru},{artist:torino aqua}, hair between eyes, hair intakes,sitting,indoors,livingroom,couch,curtain, hair ornament, hair ribbon, hairband, long hair, long sleeves, multicolored eyes, open mouth, pleated skirt, ribbon, sailor collar, shirt, skirt, thighhighs, two-tone eyes, white shirt, white sleeves, white thighhighs,{},{artist:fuzichoco},artist:kedama milk,artist:chen bin, {artist:atdan},artist:hito,artist:hiten,{artist:mignon}, rating:general
  ```
- **“太空人”**
  ```text
  high contrast, colorful, horror (theme), dark, darkness, gritty,artist: tsukushi akihito, artist:quasarcake, artist:dino \(dinoartforame\), artist: healthyman, chromatic aberration, film grain, artist: ssambatea, artist: chii (tsumami tsumamare),dim lighting, beautiful color (),{{realistic, (wlop:0.3), concept art}} aesthetic, 1990s \(style\),(glitch,dissolving:1.2),(muted colors:1.4),(black background:1.4),(dim lighting:1.2), (monochrome),graphite \(medium\) black background, (dark red background:1.3) (portrait,polaroid:1.5),(windy, faceless aberrations, ghost entities, black hole galaxy,river,sky,old photo:1.3) faceless, hole, hole in face, horror (theme), parody, simple background, upper body, what (itou junji:1.5),ulrich \(reverse:1999\),1boy,copyright name,copyright notice,ferrofluid,fishbowl helmet,galaxy,gears,grey background,helmet,logo,male focus,object head,portrait,reflection,solo,best illustration, colorful, realistic, dynamic angle, cinematic lighting,8::text:TANG::
  ```
- **37**
  ```text
  high contrast, colorful, horror (theme), dark, darkness, gritty,artist: tsukushi akihito, artist:quasarcake, artist:dino \(dinoartforame\), artist: healthyman, chromatic aberration, film grain, artist: ssambatea, artist: chii (tsumami tsumamare),dim lighting, beautiful color (),{{realistic, (wlop:0.3), concept art}} aesthetic, 1990s \(style\),(glitch,dissolving:1.2),(muted colors:1.4),(black background:1.4),(dim lighting:1.2), (monochrome),graphite \(medium\) black background, (dark red background:1.3) (portrait,polaroid:1.5),(windy, faceless aberrations, ghost entities, black hole galaxy,river,sky,old photo:1.3) faceless, hole, hole in face, horror (theme), parody, simple background, upper body, what (itou junji:1.5),37 \(reverse:1999\),1girl,ancient greek clothes,bare shoulders,bird,blue sky,closed mouth,cloud,cowboy shot,gold choker,greco-roman clothes,holding cloth,looking at viewer,simple bird,sky,smile,solo,toga,wavy hair,white bird,best illustration, colorful, realistic, dynamic angle, cinematic lighting,10::text:TANG::
  ```
- **德芙代言人**
  ```text
  plana \(blue archive\),[[[artist:betabeet]]],[[artist:yoneyama_mai]],1girl,close-up,1girl, alternate hairstyle, black choker, black jacket, black ribbon, black sailor collar, black serafuku, black shirt, black skirt, blush, braid, choker, closed mouth, colored inner hair, double v, flat chest, grey eyes, grey hair, hair ribbon, halo, jacket, looking at viewer, multicolored hair, neckerchief, pink hair, pink halo, ribbon, sailor collar, school uniform, serafuku, shirt, single braid, skirt, solo, twintails, two-tone hair, v, white neckerchief,lens flare,cinematic_lighting,lighting,photo background, blurry background, top aesthetic, no text
  ```
- **P5风格**
  ```text
  1girl, solo, keqing (genshin impact), artist:omone hokoma agm,0.8::nana_mikoto::, 0.9::ohisashiburi::,ru zhai, -2::artist collaboration::, {portrait}, {{{{{{official art, red background, flat color, partially colored,}}}}}}, [persona 5], no text
  ```
- **最终章**
  ```text
  wlop,isshiki\(ffmania7),0.7::asteroid ill,rella::,-2::artist collaboration::,1girl,dungeon,boss fight,location, size difference, perspective,depth of field,photo background,atmosphere,sunlight,solo,muted color,candid,chiaroscuro, character1： roxy migurdia,girl,solo focus,holding staff,dynamic angle,fighting stance,from back,magic,holding,cape,boots,, facing away character2： dragon,giant,wyvern,monster focus
  ```

## 三、服装 + 造型（125 条，增加造型多样性）

- **beatnik（垮掉服饰）**
  ```text
  bead bracelet,bead necklace,beads,beatnik,beret,black flower,bracelet,corset,fashion,flower,glasses,hat,jewelry,long sleeves,smile,smirk,sunglasses,sweater,turtleneck,turtleneck sweater,brown jacket,brown belt,brown sweater
  ```
- **Tenshi Kaiwai （天使界限）**
  ```text
  aged leg,apron,bandaid,bandages,bandaid on knee,frilled apron,frilled hairband,jersey maid,jacket,leg warmers,puffy long sleeves,puffy sleeves,tenshi kaiwai,sleeves past wrists,unconventional maid,white apron,white leg warmers
  ```
- **Jirai kei(地雷系)**
  ```text
  karubi,black bow,black bowtie,bow,bowtie,frilled shirt,frilled sleeves,jirai kei,long sleeves,pink shirt
  ```
- **Amesuku gyaru（阿美苏库）**
  ```text
  amesuku gyaru,black bowtie,black skirt,bowtie,breasts,ear piercing,gyaru,handbag,kogal,midriff,miniskirt,navel,open clothes,open shirt,plaid bow,plaid bowtie,plaid clothes,pleated skirt,school uniform,sleeves rolled up,tied shir
  ```
- **Dongtan dress（东滩连衣裙）**
  ```text
  black bag,black cardigan,cardigan,cleavage,dongtan dress,dress,drink,holding bag,open cardigan,open clothes
  ```
- **harem outfit （西域风格)**
  ```text
  arabian clothes,armlet,bare shoulders,bracer,brooch,dancer,dancing,diffraction spikes,gold trim,harem outfit,midriff,navel,ring,veil
  ```
- **balala the fairies （巴啦啦小魔仙）**
  ```text
  balala the fairies,1girl,anime coloring,chest jewel,closed mouth,frilled arm warmers,frilled dress,frilled sleeves,frilled vest,frills,heart-shaped gem,heart print,heart wand,holding wand,magical girl,yellow bow,yellow ribbon,yellow dress
  ```
- **trench coat （风衣）**
  ```text
  asahi breweries,beer can,belt,black belt,black necktie,black pants,coat,open clothes,open coat,shirt,trench coat,white shirt,standing,tan coat
  ```
- **sports department 运动系(自搭)**
  ```text
  belt,black jacket,black pants,closed mouth,collarbone,grey sports bra,hairclip,jacket,midriff,navel,official alternate costume,open clothes,open jacket,pants,sports bra,bare shoulders,high ponytail
  ```
- **Leisure style （休闲风）**
  ```text
  alternate costume,bag,black bag,black coat,black sweater,coat,grey skirt,handbag,long coat,plaid coat,ribbed sweater,shirt tucked in,turtleneck,turtleneck sweater,two-sided coat,two-sided fabric,pencil_skirt
  ```
- **Aristocratic clothes 贵族风格（自搭）**
  ```text
  bead necklace,beads,black dress,black gloves,black hat,black thighhighs,bright pupils,brooch,dress,feather hair,flower,hair stick,hat flower,lace-trimmed thighhighs,lace trim,layered dress,long dress,long sleeves,mandarin collar,neck tassel,pinky ring,shawl,sun hat,tilted headwear,white shawl
  ```
- **Leisure style 2 （休闲风格2）**
  ```text
  alternate costume,bare shoulders,bow,purple scarf,purple sweater,scarf,skirt,sweater,white bow,white skirt,A sweater that is both ribbed and cable knit,heart pin,pleated_skirt,The bow on the skirt
  ```
- **Aristocratic clothes 2 （贵族服装2）**
  ```text
  argyle ribbon,arm garter,bare shoulders,black bow,black choker,black gloves,black hat,black skirt,black vest,bow choker,buttons,choker,earrings,elbow gloves,frilled gloves,hat,hat bow,hat ribbon,large hat,long skirt,purple hat,rose print,shirt,sun_hat
  ```
- **Leisure style 3（休闲风格3）**
  ```text
  beret,bag,choker,handbag,holding bag,jacket,long sleeves,official alternate costume,pink choker,pink jacket,white skirt,high-waist_skirt,frills_strapless_shirt
  ```
- **Leisure style 4（休闲风格4）**
  ```text
  frilled shirt,frills,grey shirt,off-shoulder shirt,puffy short sleeves,puffy sleeves,short sleeves,spaghetti strap,high-waist skirt,pencil skirt
  ```
- **potari shrine maiden（波塔里巫女服）❤️** `nsfw?`
  ```text
  bare shoulders,blush,breasts,collarbone,ofuda,ofuda on leg,ofuda on nipples,pasties,potari shrine maiden,sleeves past fingers,sleeves past wrists,talisman,detached_sleeves,revealing_clothes,topless
  ```
- **Detective（侦探服）**
  ```text
  blue necktie,brown coat,brown gloves,brown hat,coat,collared coat,detective,gloves,hat,holding magnifying glass,long sleeves,monocle,necktie,trench coat
  ```
- **Butler（管家）**
  ```text
  alternate costume,belt,black belt,black bow,black bowtie,black pants,black vest,bowtie,butler,collared shirt,cup,dress shirt,female butler,gloves,pants,plate,shirt,white gloves,towel_on_arm
  ```
- **Steward（执事）**
  ```text
  black bow,black bowtie,black pants,butler,buttons,shirt,expressionless,breast pocket,collared shirt,jacket,lapels,long sleeves,arms_behind_back
  ```
- **Leisure style 5（休闲风格5）**
  ```text
  brown skirt,buttons,casual,cropped shirt,double-breasted,high-waist skirt,pleated skirt,shirt,beige shirt,belt_bag,long sleeves,turtleneck_sweater
  ```
- **Miss Feather Crow（羽鸦小姐）**
  ```text
  bell,beautiful detailed black gothic empire waist dress,black dress,feather-trimmed dress,cleavage cutout,detached sleeves,sleeves past wrists,lace trim,center frills
  ```
- **Under the cold winterⅠ（寒冬之下）**
  ```text
  cream fur-trimmed jacket ( long sleeves,hugging legs smoothly ),soft fur lining collar/cuffs ),white vest layered underneath ( slim-fit,loose white necktie ),short black pleated skirt ( neat folds,above knees ),black pantyhose ( sheer,bl ack leather boots ( short,laced ),black crossbody bag slung over chair arm ( small,metal clasp glinting ),cream knit scarf wrapped loosely,black fingerless gloves
  ```
- **Under the cold winter Ⅱ（寒冬之下2）**
  ```text
  bag,coat,contemporary,hair flower,gloves,hat,long skirt,long sleeves,open clothes,purple coat,purple shirt,purple skirt,shoulder bag,shirt,ribbon,scarf,white scarf,white hat
  ```
- **Ancient egyptian clothes （埃及风格）** `nsfw?`
  ```text
  egyptian,thighhigh,armlet,navel,staff,usekh collar,thigh boots,earrings,egyptian clothes,highleg,leotard,revealing clothes,elbow gloves,bracelet,tattoo,cape,ass visible through thighs,skindentation,shiny skin,chest jewel,red gemstone
  ```
- **Thorn knight （荆棘骑士）**
  ```text
  rose,headpiece,collar,adapted costume,flower,thorns,{{{{rose print}}}},silver armor,gold trim armor,pauldrons,armored dress,knight armor,rose print,{{{side cape}}},high-low_skirt,{{{Thorns entwined around the waist}}},{{thorns belt}},cowboy shot,thorns thigh strap
  ```
- **Lawson（罗森店员）**
  ```text
  convenience store,employee uniform,vertical-striped shirt,black skirt,blue shirt,short sleeves,collared shirt,uniform
  ```
- **Priest（牧师）**
  ```text
  bible (object),book,capelet,cassock,clerical collar,cross,cross necklace,holding book,jewelry,long sleeves,nail polish,open book,priest,standing,{{{{stole}}}}
  ```
- **Traditional nun（传统修女）**
  ```text
  long sleeves,{{guimpe}},nun,black dress,black veil,dress,guimpe,nun,traditional nun,white gloves,steepled_fingers
  ```
- **Demon girl（小恶魔）** `nsfw?`
  ```text
  demon horns,demon tail,demon wings,Sexy Underwear,leotard,off-shoulder dress,latex dress,latex corset
  ```
- **彩霞仙子**
  ```text
  black sash,dress,flower,green ribbon,hagoromo,orange hanfu,orange ribbon,petal on head,pink ribbon,pink shawl,qujupao,ribbon,sash,shawl,waist sash,wide sleeves,yellow hanfu
  ```
- **ouji fashion（王子时尚）** `nsfw?`
  ```text
  shirt,cropped jacket,grey shirt,puffy short sleeves,puffy sleeves,ribbon,brooch,ascot,high heel boots,lolita fashion,long sleeves,ouji fashion,puffy long sleeves,showgirl skirt,cowboy shot
  ```
- **Autumn ageⅠ（秋日时代）**
  ```text
  grey vest,waistcoat,white shirt,black pants,loose clothes,loose pants,Dark grey overcoat,long scarf,Khaki scarf,overcoat
  ```
- **Leisure style 6（休闲风格6）**
  ```text
  black bow,black bowtie,brown dress,brown hairband,brown sleeves,cross-laced clothes,cross-laced sleeves,detached sleeves,frilled bow,frilled hairband,frilled sleeves,frills,juliet sleeves,lace-trimmed choker,lace trim,layered dress,long sleeves,plaid bow,puffy sleeves,ribbon-trimmed dress,ribbon-trimmed sleeves,ribbon trim,waist bow,white ribbon,white dress
  ```
- **Under the cold winter III（寒冬之下3）**
  ```text
  badge,black corset,black gloves,blue cape,bodysuit,center frills,chain,corset,fur-trimmed cape,frilled shirt,frills,fur trim,hair ornament,white bodysuit,white shirt
  ```
- **Introverted（内向型穿搭）**
  ```text
  woolen sweater,collared shirt,white shirt,wing collar,long sleeves,very long sleeves,Dark gray wool sweater,Loose sports pants
  ```
- **Ranger（游侠服装）**
  ```text
  boots,cape,center opening,clothing cutout,elbow gloves,green cape,green shorts,hood down,hooded cape,midriff peek,shorts,shirt,sleeveless shirt,thigh boots,white boots,white shirt
  ```
- **Halloween costume-witch（万圣节服装-女巫）**
  ```text
  black dress,black hat,black sleeves,detached sleeves,dress,frilled dress,halloween costume,hat ribbon,large hat,pumpkin hat ornament,striped dress,striped hat,turtleneck dress,witch hat,witch
  ```
- **Harness（胸式安全带）**
  ```text
  arm strap,black jacket,black shorts,chest harness,collared shirt,holster,knee pads,harness,jacket,open jacket,pager,shirt,shorts,single knee pad,suit jacket,thigh holster,thigh strap
  ```
- **Pool Special Edition（泳池特典）**
  ```text
  blue bikini,bracelet,brooch,detached collar,detached sleeves,frilled sleeves,purple sarong,short sleeves,single detached sleeve,swimsuit,thigh strap,white bikini
  ```
- **Leisure style 7（休闲风格7）** `nsfw?`
  ```text
  beret,bow,bowtie,brown hat,brown skirt,collared shirt,country lolita,fashion,french girly,lolita fashion,messenger bag,plaid clothes,plaid skirt,shirt,sweater vest,white bow,white shirt,white sweater vest,center_frills
  ```
- **Wander（流浪）**
  ```text
  patchwork cloak,burlap sack material,frayed edges,thick scarf,torn_scarf,hooded_cape,torn hooded cape,torn capelet,fringe_trim
  ```
- **Tabard（塔巴德式外衣）**
  ```text
  blue cape,cape,robe,shoulder armor,floating cape,gold trim,fur collar,black long tabard
  ```
- **Lolita（洛丽塔）** `nsfw?`
  ```text
  gothic lolita,black bodice,white lace trim,thigh strap,grey skirt,lolita fashion,frilly dress,lace trim,wrist cuffs,layered skirt,victorian style,velvet textures,lolita_hairband
  ```
- **Shark pajamas（鲨鱼睡衣）**
  ```text
  shark costume,shark tail,hood up,animal costume,sleeves past wrists,shark hood,whale shark,blue pants
  ```
- **Leisure style 8（休闲风格8）**
  ```text
  bare shoulders,brooch,detached sleeves,{{elegant long skirt}},{{{{ankle-length skirt}}}},black a-line skirt,long sleeves,sleeveless shirt,white shirt,cowboy shot,frilled_sleeves,Cuffed neckline,cuffed cuffs,pencil skirt
  ```
- **Halloween costume - nurse costume（万圣节服装—护士装）❤️**
  ```text
  covering breasts,navel,white dress,garter straps,short dress,pencil dress,bandages,torn clothes,nurse cap,taut clothes,taut dress,bandaged arm,id card,lanyard,{{foreshortening}},close-up,dynamic pose,indoors,bedroom,halloween ornaments,orange theme,pink blood,blood on bandages,blood on clothes
  ```
- **Halloween costume-zombie（万圣节服装—丧尸）**
  ```text
  colored skin,{{{grey skin}}},zombie,blood on clothes,blood from mouth,bandaged head,collared shirt,detached sleeves,long sleeves,sleeveless shirt,blood on bandages,hospital gown,zombie_pose,blood on clothes,stitched_face,stitched_neck,indoors,bedroom,halloween ornaments,orange theme
  ```
- **Halloween costume-jiangshi（万圣节服装——僵尸）❤** `nsfw?`
  ```text
  chinese clothes,black nails,open mouth,outstretched arms,wide sleeves,zombie pose,china dress,dress,halloween costume,hat,jiangshi,jiangshi costume,midriff,navel,no panties,ofuda on head,ofuda,qingdai guanmao,sleeves past fingers,sleeves past wrists,talisman,underboob,indoors,bedroom,halloween ornaments,orange theme,pelvic_curtain
  ```
- **Halloween costume- mummy costume（万圣节服装-木乃伊）❤️**
  ```text
  ass visible through thighs,bare hips,bare shoulders,bat (animal),chest sarashi,curvy,halloween,halloween costume,jack-o'-lantern,makeup,mummy costume,navel,sarashi,thigh gap,thighhighs
  ```
- **Halloween costume- vampire（万圣节服装-吸血鬼）**
  ```text
  armor,ascot,bat ornament,black coat,black pants,black shirt,brooch,coat,halloween,halloween costume,red coat,red gemstone,shirt,two-sided coat,two-sided fabric,{{vampire costume}},white ascot,high_collar,black_cape
  ```
- **Halloween costume- Miss Bat（万圣节服装-蝙蝠小姐）**
  ```text
  bare shoulders,black choker,black dress,black gloves,black wings,choker,dress,halloween,jewelry,off-shoulder dress,off shoulder,wings,bat wings,bat ornament,bat earrings,feather-trimmed sleeves,boutonniere,black belt
  ```
- **Halloween costume- ghost costume（万圣节服装-幽灵）**
  ```text
  cropped legs,dress,ghost,hood,hood up,long sleeves,sleeves past fingers,sleeves past wrists,ghost costume,hood up,see-through clothes
  ```
- **Halloween costume- shiroshouzoku（万圣节服装-白装束-日本幽灵）**
  ```text
  bow,ghost costume,dress,japanese clothes,kimono,right-over-left kimono,see-through clothes,shiroshouzoku,triangular headpiece,white dress,white kimono
  ```
- **Leisure style 9（休闲风格9）**
  ```text
  large wide red and light pink stripped ribbon bow,white frilled sleeveless shirt,1.5::purple pink leather high-waist skirt,:: coral small shoulder bag,light beige open cardigan,white thighhighs
  ```
- **Phantom thief（怪盗）** `nsfw?`
  ```text
  black hat,black jacket,black leotard,black thighhighs,boots,bow,bowtie,gloves,grey vest,groin,highleg leotard,leotard under clothes,leotard,red bowtie,thighhighs,top hat,vest,white gloves,phantom_thief
  ```
- **Maid（女仆）**
  ```text
  black maid headdress,black bow tie,black maid clothes,white maid apron,long sleeves,white gloves,Long dress,white pantyhose
  ```
- **Japanese-style maid（日式女仆）**
  ```text
  maid,maid headdress,maid apron,frilled dress,frilled sleeves,frilled shirt collar,frilled bow,frilled hairband,frilled thighhighs,frilled ribbon,frilled gloves,frilled straps,lace trim,frilled apron,lace-trimmed legwear,lace choker,frilled wrist cuffs
  ```
- **Playboy bunny （兔女郎）** `nsfw?`
  ```text
  fake animal ears,rabbit ears,hairband,bare shoulders,black bowtie,white collar,detached collar,black leotard,highleg leotard,strapless leotard,black pantyhose,fishnet pantyhose,playboy_bunny
  ```
- **reverse bunnysuit （逆兔女郎）❤️**
  ```text
  crotchless,crotchless pantyhose,fake animal ears,heart maebari,heart pasties,maebari,navel,pantyhose,pasties,rabbit ears,reverse bunnysuit,reverse outfit,shrug (clothing)
  ```
- **backwards virgin killer sweater（后背处女杀手）❤️**
  ```text
  backwards virgin killer sweater,breasts,revealing clothes,navel,sweater,turtleneck,turtleneck sweater,virgin killer sweater,white sweater
  ```
- **Leisure style 10（休闲风格10）**
  ```text
  blue skirt,collared shirt,double-breasted,dress,puffy long sleeves,shirt tucked in,skirt,suspender skirt,suspenders,white bowtie,white bow,white pantyhose
  ```
- **Suit（西装）**
  ```text
  black coat,black necktie,black vest,coat,collared shirt,long sleeves,necktie,shirt,vest,white shirt
  ```
- **ancient greek clothes（古希腊服装）**
  ```text
  ancient greek clothes,bracelet,pelvic curtain,single-shoulder dress,gold earrings,greco-roman clothes,robe,single bare shoulder,white robe,chiton,laurel_crown
  ```
- **Leisure style 11（休闲风格11）**
  ```text
  belt,black belt,black gloves,black jacket,black pants,crop top,fingerless gloves,gloves,grey tube top,jacket,navel,midriff,open jacket,tube top,linked_piercing,The chain on the pants
  ```
- **Cheerleader（拉拉队员）** `nsfw?`
  ```text
  bare shoulders,cheerleader,holding,holding pom poms,panties,pom pom (cheerleading),navel,skirt,white panties,white skirt,belt buckle,highleg_panties,arm up,standing on one leg
  ```
- **Under the cold winter IV（寒冬之下4）**
  ```text
  brown gloves,fur-trimmed sleeves,fur trim,winter clothes,brown jacket,jacket,plaid clothes,plaid scarf,duffel_coat
  ```
- **Kyuudou（弓道）**
  ```text
  blue skirt,gloves,japanese clothes,kyuudou,muneate,partially fingerless gloves,skirt,yugake
  ```
- **sports department II（运动系2）**
  ```text
  gym uniform,gym_shorts
  ```
- **Alice（爱丽丝）**
  ```text
  apron,blue bow,blue bowtie,blue dress,bow,dress,hair bow,maid apron,petticoat,pink flower,short sleeves,white apron,white thighhighs,hair_bow
  ```
- **Santa costume（圣诞装）**
  ```text
  santa costume,Christmas tree,santa dress,Christmas present
  ```
- **Leisure style 12（休闲风格12）**
  ```text
  t-shirt,black jacket,black pants,brown belt,jacket,open jacket,open clothes,padded jacket,two-sided jacket,white shirt,zipper pull tab,track_pants
  ```
- **Uniform（校服）**
  ```text
  winter clothes,sweater,long sleeves,grey sweater,v-neck,sweater jacket,brown necktie,collared shirt,puffy sleeves,ribbon-trimmed shirt,ribbon trim,white shirt
  ```
- **Leisure style 13（休闲风格13）**
  ```text
  dark tailored jacket,long-sleeved ribbed shirt,high collar,black high-waist skirt,gold buttons,blue gem pendant,layered necklace
  ```
- **汉服（壹）**
  ```text
  hanfu,white hanfu,modernized chinese clothes,pankou,bamboo print on sleeves,long tassels,white robe
  ```
- **Uniform II（校服2）**
  ```text
  black socks,brown skirt,cardigan,frilled skirt,frills,long sleeves,medium skirt,open cardigan,open clothes,plaid clothes,plaid skirt,pleated skirt,sleeves past wrists,socks,white shirt,bow,yellow bow,shirt bow
  ```
- **Steward II（执事2）**
  ```text
  gloves,black gloves,black shirt,necktie,black vest,black pants,red necktie,shirt,black jacket,pants,long sleeves,coat on shoulders,adjusting gloves,vest,collared shirt,suit,formal,black suit,adjusting clothes,belt,lapels,profile,expressionless
  ```
- **Gorgeous military uniform（华丽军装）** `nsfw?`
  ```text
  black coat,messy hair,military lolita,aristocratic clothes,peaked cap,black cap,dress shirt,white shirt,cross tie,black tie,insignia,belt,corset,dark aqua coat,double-breasted,peacoat,black skirt,aqua skirt,over skirt,medium skirt,framed breasts,black belt,frilled sleeves,frills,gold trim,frilled skirt,puffy long sleeves,expressionless,military hat
  ```
- **sports department III（运动系3）**
  ```text
  jacket,shorts,ponytail,visor cap,long sleeves,black jacket,thighs,track_jacket,zipper
  ```
- **Leisure style 14（休闲风格14）**
  ```text
  beret,black beret,red band (on beret),golden star accessory (on beret),dark brown coat,long coat,open coat,long sleeves,ruffled cuffs,golden buttons (on cuffs),red lining (on coat),red trim (on coat edges),red ribbon (on coat),golden star pin (on lapel),white long-sleeved shirt,standing collar,red vest,red bodice,gold
  ```
- **汉服（贰）**
  ```text
  traditional clothing,chinese clothes,hanfu,historical clothing,wide sleeves,long sleeves,loose clothing,light blue outer robe,teal jacket,white trim (on jacket),red inner top,v-neck,yellow obi,yellow waist sash,decorative tassel,red tassel,circular pendant,teal pendant,long white overskirt,sheer fabric (skirt),translucent fabric (skirt),layered skirts,orange pleated skirt,long skirt,red ribbons (hair accessories),flowing fabric,cowboy shot
  ```
- **enamel leather dark nurse（深色皮革护士服）** `nsfw?`
  ```text
  fetishwear,latex costume,shiny material,black latex,nurse cap,black nurse cap,white cross (on cap),high neck,turtleneck,short puff sleeves,detached sleeves,open chest,large breasts,ample cleavage,exposed cleavage,chest cutout,triangular bralette,black bikini top (under latex),exposed midriff,corset-like bodice,black corset,zipper (front),cinched waist,mini dress,very short dress,black mini skirt,high-cut skirt,exposed hips,long gloves,black gloves,opera length gloves,buckled gloves,attached garters,thigh-highs,shiny stockings,panties (visible),light colored underwear,skimpy panties
  ```
- **仙侠服装**
  ```text
  chinese clothes,hanfu,wuxia,xianxia,1.3::white long coat::,fantasy style,{tabard},robe,structured clothes,v-neck,1.1::shoulder armor::,stylized pauldrons,grey trim on clothes,1.2::white vambraces::,arm guards,gauntlets,black fingerless gloves,1.3::wide black waist sash::,obi,gold trim on belt,long flowing coattails,1.2::black fitted undershirt::,cowboy shot
  ```
- **Santa costume II（圣诞装2）**
  ```text
  christmas hat,santa hat,white pompom on hat,white fur trim on hat,fur-trimmed hat,red cape,white fur collar,layered cape,white cable knit sweater,oversized sweater,long sleeves,bow on sweater,red bow,green ribbon,striped ribbon,jingle bell,black pantyhose,winter clothing
  ```
- **汉服（叁）**
  ```text
  traditional chinese clothes,hanfu-inspired,cheongsam,dark blue outerwear,long sleeves,very wide sleeves,white furry collar,white fur trim,furry trim,mandarin collar,black mandarin collar,frog closures,golden frog closures,ornamental buttons,golden trim,golden embroidery,ornamental details,golden pattern on skirt,layered clothing,inner dark top,purple sash,purple ribbon,tassels,golden buckle,white short skirt,embroidered hem,pleated skirt
  ```
- **Adventurer's Outfit（冒险者服装）**
  ```text
  rugged clothing,adventurer outfit,dark fantasy fashion,heavy duty attire,tightly wrapped scarf,high collar,dark gray rugged jacket,thick heavy fabric coat,mil itary-style coat,open jacket,long sleeves,1.2::oversized spiked fur collar::,dark spiky fur trim,jagged fur edges on collar,layered shoulder pads,dark metal buckles on shoulders,leather straps over shoulders,black fitted undershirt,dark inner long-sleeve garment,broad dark leather belt,multiple interlocking leather belt straps,large rectangular polished metal buckle,utilitarian belt design,dark rugged trousers,plain heavy pants,red padded gloves
  ```
- **Under the cold winter V（寒冬之下5）**
  ```text
  white coat,long coat,overcoat,trench coat,loose coat,oversized coat,collared coat,knitted scarf,thick scarf,light grey scarf,fringed scarf,wrapped around neck scarf,textured scarf,black dress,long dress,loose dress,dark clothing,shoulder bag,black bag,simple handbag,long sleeves (under coat),fashionable clothing,minimalist fashion
  ```
- **Goth fashion dress （哥特连衣裙）** `nsfw?`
  ```text
  gothic lolita dress,fantasy dress,intricate gothic dress,silver and dark grey dress,high quality,clothing,1.2::sheer lace veil::,embroidered veil,floral embroidery on veil,translucent veil,choker ribbon,large silver bow on neck,ruffled collar,sweetheart neckline,1.1::silver corset bodice::,lacing on bodice,pleated bust,puffy short sleeves,ruffled sleeves,bows on sleeves,1.3::voluminous ball gown skirt::,layered skirt,sheer overlay skirt,dark grey skirt,pleated ruffles on skirt,ornamental bows on skirt,silver accents on skirt,ribbon accents,full skirt
  ```
- **Under the cold winter VI（寒冬之下6）**
  ```text
  trench coat,light beige coat,open coat,long coat,burgundy scarf,knitted scarf,white ribbed knit top,thick scarf,high neck top,black strapless dress,fitted dress,mini dress,layered clothing,black pantyhose,black handbag,quilted handbag,gold chain detail on bag,fashionable,trendy,elegant,smart casual,winter outfit
  ```
- **Knight（骑士）**
  ```text
  silver plate armor,silver breastplate,white angular pauldrons,silver vambraces,white metal gauntlets,1.2::high neck gorget,silver segmented tassets,armor plates::,1.1::wide cape::,green fabric bib,dark blue loincloth,hanging waist fabric,dark green tunic,dark blue leggings
  ```
- **Mage（法师）**
  ```text
  1.5::dark purple hooded robe,long purple cloak,1.4::intricate gold embroidery,gold lace trim,ornate gold patterns on hem and sleeves::,1.3::decorative front tabard,rectangular panel with gold lace,small white circular tassels::,1.4::wide bell sleeves,layered fantasy robe::,sophisticated priestess attire::,staff,holding_staff,mage_staff,cowboy shot
  ```
- **On the stage I（舞台之上1）**
  ```text
  1.5::red and white color scheme::,1.4::idol outfit,ornate dress::,1.2::headset,head-mounted microphone::,1.2::layered frilled skirt,pleated mini skirt::,white corset with red lacing,golden embroidery patterns,puff sleeves with lace trim,detached ruffled cuffs,white satin ribbons,1.1::gemstone buttons,heart-shaped ornaments,layered petticoat,sheer lace hemline,high collar with ruffles,silken sheen,cowboy shot,gold crown,crown hat
  ```
- **On the stage II（舞台之上2）**
  ```text
  1.5::green and white color scheme::,1.4::clean and peaceful idol outfit::,1.3::ultra-detailed,intricate details::,1.2::headset,ornate head-mounted microphone::,white silk bodice,soft mint green accents,layered translucent chiffon skirt,delicate lace embroidery,floral lily motifs,white satin ribbons,silver filigree ornaments,pearl trimmings,bell-shaped sleeves with lace edges,high collar,polished metallic details,silk sash,pristine fabric texture,gentle folds
  ```
- **On the stage III（舞台之上3）**
  ```text
  1.5::yellow and white idol outfit,elegant dress::,1.3::intricate details,gold filigree,gold embroidery::,white bodice,sweetheart neckline,high neck,lace-trimmed collar,sheer lace shawl,blue gemstone,short puff sleeves,yellow ribbons on sleeves,yellow sash,1.4::large sunflower on waist,yellow ribbon bow on hip::,1.3::multi-layered ruffled skirt,yellow tiered skirt::,white lace-edged peplum,golden tiara,sunflower hair ornament,yellow hair bow,head-mounted microphone
  ```
- **On the stage IV（舞台之上4）**
  ```text
  1.5::navy blue and black idol outfit::,1.4::gothic chic style,intricate details::,1.3::mechanical headset with side fin and boom microphone::,1.3::black pleated choker with large oval blue sapphire brooch::,1.2::dark blue sweetheart bodice::,1.3::sheer black mesh neck and chest panel::,1.2::white thorn embroidery on top edge::,1.3::detached sheer black arm warmers,netting at wrists::,1.2::blue sheer frilled shoulder accents::,1.4::wide black waist corset,multiple buckled leather belts,hanging silver chains and rings::,1.2::segmented blue gem ornament on belt::,1.3::tiered navy blue ruffled skirt::,1.3::black translucent lace overskirt,white diamond and constellation patterns on hem::,exquisite fabric texture
  ```
- **Adventurer's Outfit II（冒险者服装2）**
  ```text
  1.5::bloodborne style hunter outfit,dark victorian gothic clothing::,1.3::weathered and tattered edges,ragged fabric::,1.4::dark brown duster coat,long coat with double-layered mantle::,pelerine,1.3::high collar neck wrap,multiple leather belts across chest,1.4::tattered hunter hat,ragged tricorn hat::,black gloves
  ```
- **Winter military uniform（冬季军装）**
  ```text
  1.3::military officer uniform::,navy blue and gold theme,golden horseshoe emblem,golden rope chin strap on hat,1.2::military jacket with fur collar::,black faux fur lapels,1.1::double-breasted::,gold buttons,1.3::braided gold aiguillette::,hanging shoulder chains,gold shoulder epaulettes,white collared shirt,olive green necktie,golden collar pins,1.2::shoulder-draped cape with yellow lining::,black leather gloves,wide belt,structured silhouette,heavy fabric texture,metallic shine
  ```
- **汉服（肆）**
  ```text
  1.3::ethereal traditional chinese robes::,1.2::white silk hanfu::,layered crossover collar,1.3::ornate silver panzhang knots on shoulder::,1.2::long black hanging tassels::,silver filigree brooch with chains,1.2::white chiffon over-robe::,natural organic leaf texture,1.2::panzhang knot tassel earrings::,high-waist flowing skirt,shimmering fabric texture,long sleeves,wide sleeves
  ```
- **Leisure style 15（休闲风格15）**
  ```text
  1.3::layered top::,1.2::brown plaid over-shirt with cold-shoulder::,dark brown high-neck inner,1.1::asymmetrical collar::,short sleeves with cuffs,1.2::small brown bowtie on chest::,1.3::high-waisted chocolate brown A-line skirt::,1.1::vertical buttons on skirt::,1.2::thin leather belt with silver buckle::,white ruffled hemline peeking out
  ```
- **magician style（魔术师风格）** `nsfw?`
  ```text
  1.1::gothic lolita::,1.2::black top hat::,1.3::oversized black bowtie::,center brooch,green gemstone brooch,silver-framed brooch,1.2::white blouse::,high neck,ruffled collar,white bell sleeves,ruffled cuffs,frilled wrist,1.2::black vest::,tight-fitting vest,1.4::mismatched legwear::,1.4::asymmetrical leggings::,1.3::left leg vertical stripes::,1.2::black and white stripes::,1.3::right leg harlequin pattern::,1.2::diamond print tights::,1.2::silver cross earrings::,layered outfit
  ```
- **Leisure style 16（休闲风格16）**
  ```text
  1.2::beret::,1.1::plaid hat::,1.1::hat ornament::,1.4::short cape::,1.2::black capelet::,1.1::silver trim::,1.1::embroidery::,1.3::silver chain::,1.2::metal chain::,1.3::blue frilled shirt::,1.2::light blue blouse::,1.2::ruffled sleeves::,1.2::frilled cuffs::,wrist cuffs,1.4::blue neck ribbon::,1.2::bowtie::,1.2::center brooch::,1.2::black vest::,1.1::double-breasted vest::,silver buttons,1.4::plaid skirt::,1.3::checkered skirt::,1.2::blue plaid::,1.2::frilled skirt::,pleated skirt,1.2::black pantyhose::,1.4::thigh straps::,gothic victorian,notched_lapels
  ```
- **Leisure style 17（休闲风格17）** `nsfw?`
  ```text
  1.4::punk lolita::,1.3::gothic fashion::,1.3::military lolita::,1.5::red and black plaid::,1.4::checkered pattern::,1.3::tartan dress::,1.4::sleeveless tiered dress::,1.3::layered frilled skirt::,1.2::ruffled hem::,white underlayer,1.4::black leather corset belt::,1.3::double waist belt::,criss-cross straps,heart-shaped chain,1.3::striped necktie::,black and white stripes,1.4::detached plaid sleeves::,fingerless gloves,arm warmers,studded cuffs,1.3::black military hat::,rebellious aesthetic
  ```
- **Adventurer's Outfit III（冒险者服装3）**
  ```text
  1.4::gothic battle dress::,1.3::military techwear::,1.5::structured double-layered capelet::,1.4::stiff stand-up collar::,1.3::huge black neck bow::,1.3::silver cross brooch::,1.5::ornate silver filigree on skirt::,1.4::symmetrical floral embroidery::,1.4::silver leaf pattern::,1.5::heavy-duty tactical belt::,1.4::mechanical metal buckle::,1.4::black pleated mini skirt::,1.3::white layered petticoat hem::,1.4::split long tailcoat::,1.3::flowing back panels::,1.4::detached flared sleeves::,1.3::black arm warmers with straps::,fingerless gloves
  ```
- **Under the cold winter VII（寒冬之下7）**
  ```text
  1.5::brown winter outfit::,1.4::warm earth tones::,1.3::layered winter clothing::,1.5::fluffy white fur trim::,1.4::fleece-lined collar::,1.4::white pom-pom trim::,1.5::short brown poncho::,1.4::capelet with toggle bolts::,1.3::wooden duffle coat buttons::,1.4::brown pleated skirt::,1.3::flare skirt::
  ```
- **Leisure style 18（休闲风格18）**
  ```text
  long black military trench coat,open-front duster coat,1.2::notched lapel::,golden filigree embroidery on coat,gold-traced patterns,ornate gold piping,grey collared dress shirt,black pleated mini skirt,white lace-trimmed hemline,tactical waist belt with gold buckles,multiple belt straps,golden hanging chain on hip,utility pouches,dark aesthetic,black gloves,opaque black pantyhose,-1::coat_on_shoulders::
  ```
- **Western swordsman（西洋剑客）**
  ```text
  navy blue cavalier hat,wide-brimmed slouch hat,two large white feathers on hat,navy blue shoulder cape,cloak with white piping edges,black necktie,white long sleeves with frilled cuffs,thin dueling blade,dark blue and grey color palette,green leaves on rose,red rose pinned to collar,1.2::center brooch::,green gemstone brooch,silver-framed brooch,1.2::white blouse::,high neck
  ```
- **Aristocratic clothes 3 （贵族服装3）** `nsfw?`
  ```text
  navy blue military frock coat,long coat with gold piping,open-front jacket,gold-rimmed lapels,dark grey pleated skirt,white frilled underskirt,layered hemline,black corset waistcoat,double-breasted vest with gold buttons,golden chain accessory on waist,navy blue jabot tie,large blue neck bow,golden brooch on cravat,blue rose corsage on lapel,white dress shirt with high collar,gold-trimmed cuffs,military lolita,gold and navy theme,sharp tailoring,elegant silhouette
  ```
- **Leisure style 19（休闲风格19）**
  ```text
  mint green plaid blazer,light green checkered suit jacket,open front jacket,subtle white grid pattern,dark brown button-up blouse,ruffled stand collar,white high-waisted pleated miniskirt,flared skirt silhouette,school uniform style,anime fashion,soft shading
  ```
- **Suit 2（西装2）**
  ```text
  belt,black coat,black necktie,black pants,coat,collared shirt,dress pants,dress shirt,id card,lanyard,long sleeves,open clothes,open coat,shirt,holding_cigarette,smoking
  ```
- **Doctor**
  ```text
  white knee-length lab coat,physician coat,stiff cotton fabric texture,clean white medical gown,wide notched lapels on coat,solid dark red necktie,chest pocket with pens,silver ballpoint pen clipped in pocket,straight leg slacks,black leather belt with silver buckle
  ```
- **erotic clothing (色情服装) ❤️** `nsfw?`
  ```text
  cupless bra,bra,breasts,mask pull,mouth mask,naked lab coat,surgical mask,underwear,white mask,white knee-length lab coat,physician coat,stiff cotton fabric texture,clean white medical gown,nipples
  ```
- **红婚纱**
  ```text
  traditional chinese hanfu,imperial red silk fabric,ancient chinese wedding attire,ming-style red robe,square collar cross-dress,wide long flowing sleeves,layered silk garments,embroidery of peony and vines,golden trim on sleeve edges,wide red silk waistband with gold embroidery,lavish golden phoenix crown,buyao hairpins,red forehead mark (huadian)
  ```
- **Magical girl（魔法少女）**
  ```text
  lavender purple magical girl dress,pastel idol coordinate,layered frilly outfit,short-sleeved lavender bolero jacket,puffy sleeves with pink bow cuffs,large purple bow on chest with gold circular gem,scalloped hemline on jacket,white corset-style inner bodice,pointed waistcoat hem,puffy lavender miniskirt,white ruffled underskirt,white frilly bloomers visible underneath,layered lace petticoat,magical_girl
  ```
- **Adventurer's Outfit IV（冒险者服装4）**
  ```text
  1.3::blue mantle,blue capelet::,1.3::long blue coat::,hood down,1.2::brown leather shoulder pads,silver metal buckles on chest,front open,white edges,white trim,long sleeves,1.1::white bands on cuffs,folded cuffs::,1.2::grey pleated shirt,high collar,1.2::small green gemstone pendant,jewelry::,1.2::double brown leather belts::,black pouch on waist,white lining,layered clothing,fantasy adventurer uniform,1girl
  ```
- **Adventurer's Outfit V（冒险者服装5）**
  ```text
  laurel leaf hair accessory,dark green tunic underneath,layered dark green elven robes,white fur-trimmed collar,large dark green hooded cloak,ornate gold flower chain necklace with teal gemstone,wide flowing sleeves with golden triangle pattern borders,dark brown leather fingerless gloves,double dark brown leather waist belts with silver buckles,holding a large ornate golden harp,fantasy bard aesthetic,forest protector
  ```
- **游荡剑客**
  ```text
  ronin,traditional eastern clothing,layered robes,tattered clothes,dark brown oversized coat,grey inner tunic,dark green scarf,straw hat,conical hat,weathered texture,large sake gourd,brown gourd with tassel,nomadic style
  ```
- **魔王 希斯克利夫**
  ```text
  wuthering heights (identity) (project moon),apathetic,dirty clothes,dark brown dilapidated coat,dark brown dilapidated shirt,dark brown dilapidated pants,shaded face,closed mouth,cosplay,erlking heathcliff (project moon) (cosplay),holding coffin,upper body
  ```
- **Wedding dress（婚纱）**
  ```text
  bridal veil,frilled collar,frills,hair flower,hair ornament,sleeveless,sleeveless dress,veil,wedding dress,wedding ring,white bow,white flower,white veil
  ```
- **Priestess（圣女）**
  ```text
  white fantasy priestess dress,veil,divine habit,high neck collar,gold floral brooch,red gemstone pendant,gold filigree embroidery,gold waistband,large red jewel on waist,puffy sleeves,white silk gown,flowing fabric,elegant and holy atmosphere
  ```
- **trench coat II （风衣2）**
  ```text
  tan trench coat,double-breasted coat,waist tie,belted waist,knee-length coat,long sleeves,cuff straps,shoulder flaps
  ```
- **Steampunk（蒸汽朋克）**
  ```text
  steampunk fashion,mechanical gears on hat,monocle,steampunk top hat,feathered hat decoration,dark brown capelet,black bow tie,brown shorts,cross-body bag,leather satchel,vials attached to bag,shoulder pads,brown trench coat,white dress shirt,open coat
  ```
- **Pope （教皇）**
  ```text
  traditional clergy bishop attire,medieval church fantasy outfit,red and gold hooded shoulder cape,moissette-style short pelerine,flowing ceremonial robe,tall bishop mitre hat,white hat with red side panels,golden cross emblem on front of hat,rigid structured headpiece
  ```
- **Russian style （俄罗斯风格）**
  ```text
  white double-breasted winter coat,thick wool fabric texture,trench coat style,oversized round grey buttons,high standing funnel collar,fur-trimmed white Cossack hat,fluffy white ushanka-style hat,delicate pearl beads hanging from hat brim,small white flower ornaments on hat,wide grey leather waist belt,double belt design,silver rectangular buckles,cinched waist silhouette,dark brown rib-knit cuffs,layered sleeve detail
  ```
- **Lolita II（洛丽塔2）** `nsfw?`
  ```text
  pink and white sweet lolita dress,layered frilly princess coordinate,pink corset-style bodice,white criss-cross ribbon lacing on chest,vertical lace trim on torso,scalloped neckline,large pink bow on collar with a central white rose,multiple small pink bows on sleeves and waist,detached long pink sleeves,puffy upper sleeves with ruffled cuffs,white lace-edged sleeve openings,voluminous multi-layered frilly miniskirt,alternating pink and white ruffled tiers,delicate white lace hemline with floral patterns,small cross-shaped hair clip
  ```
- **Knights templar（圣殿骑士团）**
  ```text
  medieval crusader knight armor,full set of battle-worn plate and chainmail,white sleeveless surcoat over armor,red cross on chest,dark grey chainmail hauberk underneath,steel greaves and sabatons,rugged leather pouch,brown leather belt with scabbard,torn white cape fluttering in wind
  ```
- **汉服（伍）**
  ```text
  traditional chinese clothes,hanfu,xianxia,wuxia,white long robe,cross collar,wide sleeves,narrow cuffs,light blue obi,multi-layered belts,long hanging waist ribbons,white wide-sleeved outer robe,pale blue inner robe with golden embroidery
  ```

## 四、50 张任务分配方案（已确认）

- 分级：**general 30 / sensitive 12 / nsfw 8**，无 r18g（用户明确不要重口，原 r18g 的 2 张并入 nsfw）。

- 多样性规则：每张从「场景构图」选 1 个 + 「动作姿势」选 1 个 + 「服装造型」选 1 个，三者交叉组合，避免重复同一种子/画师/构图。

- 固定参数沿用工作流：832×1216 / euler_a / 8 步 / CFG 1 / @askzy 等画师串轮换；一次只改一个变量。
