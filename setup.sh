#!/bin/sh
chmod u+x hooks/pre-commit.sh
cp $PWD/hooks/pre-commit.sh .git/hooks/pre-commit
