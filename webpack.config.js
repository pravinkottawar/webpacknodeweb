/* eslint-disable no-console, flowtype/require-valid-file-annotation */
const { resolve } = require('path')
const webpack = require('webpack')
const TerserPlugin = require('terser-webpack-plugin')
const ProgressBarPlugin = require('progress-bar-webpack-plugin')
const { getIfUtils, removeEmpty } = require('webpack-config-utils')
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const CompressionPlugin = require("compression-webpack-plugin");


module.exports = env => {
    const { ifProduction, ifNotProduction } = getIfUtils(env)
    const mode = ifProduction('production', 'development')

    return {
        mode,
        //context: resolve('./src/public/js'),
        entry: {
            index: './.dist/public/main.js',
        },
        output: {
            filename: '[name].min.js',
            chunkFilename: '[name].min.js',
            path: resolve('./src/public/js/'),
            pathinfo: true,
        },
        devtool: 'source-map',
        module: {
            rules: [
                {
                    test: /globalize/,
                    use: [{ loader: 'imports-loader?define=>false' }],
                },
                {
                    test: /\.(js|jsx)?$/i,
                    exclude: /node_modules/,
                    use: [
                        {
                            loader: 'babel-loader'
                        },
                    ]
                }/*,
                {
                    test: /\.(png|jpe?g|gif|eot|woff|woff2)$/i,
                    use: [
                        {
                            loader: 'file-loader',
                            options: { emitFile: false },
                        },
                    ],
                },
                {
                    test: /\.css$/,
                    use: ['style-loader', 'css-loader'],
                }*/
            ],
        },
        optimization: {
            splitChunks: {
                cacheGroups: {
                    commons: {
                        test: /[\\/]node_modules[\\/]/,
                        name: 'vendors',
                        chunks: 'all',
                    },
                },
            },
            minimizer: removeEmpty([
                ifProduction(
                    new TerserPlugin({
                        parallel: true,
                        extractComments: "all",
                    })
                ),
            ]),
        },
        plugins: removeEmpty([
            new ProgressBarPlugin(),
            //ifNotProduction(new BundleAnalyzerPlugin()),

            /*
            new webpack.DefinePlugin({
                'process.env.NODE_ENV': JSON.stringify(
                    ifProduction('production', process.env.NODE_ENV || 'development')
                ),
            }),

            ifProduction(new webpack.LoaderOptionsPlugin({ minimize: true })),
            ifProduction(new webpack.optimize.ModuleConcatenationPlugin()), // scope hoisting
            */
            new CompressionPlugin({
                include: /\.(js|jsx)?$/i,
                filename: "[path][base].gz"
            })
        ]),
        resolve: {
            extensions: ['.js', '.jsx', '.json']
        },
    }
}
