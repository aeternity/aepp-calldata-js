import path from 'path'
import webpack from 'webpack'
import HtmlWebpackPlugin from 'html-webpack-plugin'

export default {
    mode: 'development',
    output: {
        path: path.resolve('./build/js'),
    },
    plugins: [
        new HtmlWebpackPlugin(),
        new webpack.ProvidePlugin({
            process: 'process/browser',
        }),
    ],
    performance: {
        maxEntrypointSize: 400e3,
        maxAssetSize: 400e3,
    },
    resolve: {
        alias: {
            ava: 'tape',
        },
        fallback: {
            'stream': new URL(import.meta.resolve('stream-browserify')).pathname,
            'path': false,
        },
    },
}
