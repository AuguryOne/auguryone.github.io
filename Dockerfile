FROM ruby:3.2.3

RUN apt-get update -qq && apt-get install -y build-essential

ENV APP_HOME /auguryone.github.io
RUN mkdir $APP_HOME
WORKDIR $APP_HOME

RUN gem install jekyll

ADD . $APP_HOME