const fs = require('fs');
const path = require('path');
const webpack = require('webpack');

module.exports = {
  mode: 'development',

  // 把不同章节的DEMO放到不同examples下的子目录中，每个子目录下会创建一个app.ts，作为webpack构建的入口文件
  // entries收集了多个目录的入口文件，并且每个入口还引入了一个用于热更新的文件
  // entries是一个对象，key为目录名
  entry: fs.readdirSync(__dirname).reduce((entries, dir) => {
    const fullDir = path.join(__dirname, dir)
    const entry = path.join(fullDir, 'app.ts')
    if (fs.statSync(fullDir).isDirectory() && fs.existsSync(entry)) {
      entries[dir] = ['webpack-hot-middleware/client', entry]
    }
    return entries
  }, {}),

  output: {
    path: path.join(__dirname, '__build__'),
    filename: '[name].js',
    publicPath: '/__build__/'
  },

  module: {
    rules: [
      {
        test: /\.ts$/,
        enforce: 'pre',
        use: [{ loader: 'tslint-loader' }]
      },
      {
        test: /\.tsx?$/,
        use: [
          {
            loader: 'ts-loader',
            options: {
              transpileOnly: true
            }
          }
        ]
      },
      {
        test: /\.css$/,
        use: [
          'style-loader','css-loader'
        ]
      }
    ]
	},
	
	resolve: {
		extensions:['.ts','tsx','.js']  //解析的时候默认添加
	},

	plugins: [
		new webpack.HotModuleReplacementPlugin(),
		new webpack.NoEmitOnErrorsPlugin()
	]
} 