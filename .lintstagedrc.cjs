module.exports = {
  "*.json": ["prettier --write"],
  "*.md": ["prettier --write"],
  "*.yml": ["prettier --write"],
  "*.scss": ["stylelint --fix", "git add"],
};
