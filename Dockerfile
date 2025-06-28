FROM ruby:3.3.4-bullseye

RUN apt-get update -qq && apt-get install -y build-essential

ENV APP_HOME /auguryone.github.io
RUN mkdir $APP_HOME
WORKDIR $APP_HOME

RUN gem install jekyll

ADD . $APP_HOME