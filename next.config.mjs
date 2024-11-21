import path from 'path';

/** @type {import('next').NextConfig} */
const nextConfig = {
  sassOptions: {
    includePaths: [path.join(process.cwd(), 'src')],
    prependData: `@use "src/theme/index.scss" as *;`,
  },
};

export default nextConfig;
