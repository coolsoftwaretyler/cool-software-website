---
layout: post
title: Build a Rails Engine to Accept Stripe One-time Payments
tags: ['post']
description: I find myself writing the same Stripe functionality frequently. To save time, I wrote a Rails Engine to handle one-time payments. 
date: 2020-05-13
canonical_url: 'https://coolsoftware.dev/build-a-rails-engine-to-accept-stripe-one-time-payments/'
highlight: Ruby
---

I maintain a handful of Ruby on Rails applications for my clients. Most of them need to handle payments. My go-to payment processor is [Stripe](https://stripe.com/). Stripe makes payments easy, but still requires some setup and configuration. I've written the same one-time payment feature about five times with slight variations, so I wanted to make it easier to repeat.

This sort of abstraction is a good candidate for a [Rails engine](https://guides.rubyonrails.org/engines.html). 

Engines are basically sub-applications that provide functionality to a host application. They're great if you have some set of features that could reasonably be separated into their own application, but require a high amount of interoperability with your main application. (Thanks to [Noah Gibbs](https://codefol.io/) for the phrasing on that one).

I wrote a proof-of-concept engine that: 

1. Takes custom payment amounts
2. Takes credit cards from customers
3. Creates charges using Stripe

With that engine in hand, I can include it in any future project, provide the Stripe credentials, and save quite a bit of time. 

Here's how you can do something similar.

## Generate the engine

In the command line, run the [rails plugin generator](https://guides.rubyonrails.org/engines.html#generating-an-engine) with the `--mountable` flag.

```sh
rails plugin new payments --mountable 
cd payments
```

## Update the gemspec

The engine gemspec will have some `TODO` items in `payments.gemspec`. Fill them in:

```rb
# payments.gemspec
# . . . other config here
  spec.homepage    = "https://ogdenstudios.xyz"
  spec.summary     = "Adds Stripe one-time payment capability"
  spec.description = "Adds Stripe one-time payment capability"
# . . . the rest of the gemspec 
```

Then run `bundle`. Once the installation is complete, check the engine is running by running `rails s` in the console and visiting `localhost:3000`. The standard Rails welcome page should appear. 

## Add the Stripe gem

Adding gems to a Rails engine is a little different than adding them to a Rails app. We have to use the `gemspec` instead of a `Gemfile`. To add the [Stripe gem](https://github.com/stripe/stripe-ruby) to the engine, update `payments.gemspec`.

```rb
# payments.gemspec 
# . . . other configuration here
  spec.add_dependency "stripe"
# . . . the rest of the gemspec
```

Then `bundle` again. 

## Create the payment_intents controller

Stripe uses [PaymentIntents](https://stripe.com/docs/api/payment_intents) to process payments. The idea is to take some information from the customer, combine it with your credentials, and pass back an object that represents an intent to make a payment. Then we submit that intention to Stripe. Stripe verifies all the information is correctly formatted, and handles the final processing. 

Let's make a `PaymentIntentsController`. This controller will only have one method for now, the `create` method. We'll use it to create a PaymentIntent and return it as a JSON response to our engine's view, which will then pass that PaymentIntent to Stripe for processing.

Create a file at `app/controllers/payments/payment_intents_controller.rb`. Inside: 

```rb
# app/controllers/payments/payment_intents_controller.rb
require 'Stripe'
module Payments
    class PaymentIntentsController < ApplicationController
        def create 
            Stripe.api_key = Rails.configuration.x.stripe.secret
            @intent = Stripe::PaymentIntent.create({
                amount: params[:amount],
                currency: 'usd',
            })
            render json: @intent
        end
    end
end
```

This method configures the `Stripe` object, available through the Stripe gem, with the secret key. It creates a PaymentIntent from the supplied `params` hash and returns the intent as a JSON response. 

## Add the PaymentIntent create route

We have to provide access to the controller method through our routing. In `config/routes.rb`, add the `create` route for `payment_intents`. Like this:

```rb
# config/routes.rb
Payments::Engine.routes.draw do
    resources :payment_intents, only: [:create]
end
```

## Add a checkout controller

`PaymentIntentsController` only handles creating the PaymentIntent. We also need a view for users to interact with the engine and make payments. We can call that a `Checkout`, and manage it through a `CheckoutsController`. Create a file at `app/controllers/payments/checkouts_controller.rb`.

```rb 
# app/controllers/payments/checkouts_controller.rb
module Payments
    class CheckoutsController < ApplicationController
        def new 
        end
    end
end
```

This controller is only responsible for rendering the view that creates a new checkout, so we only need the `new` method. 

## Route to the checkouts controller

Update `config/routes.rb` so it looks like this:

```rb
#config/routes.rb
Payments::Engine.routes.draw do
    resources :checkouts, only: [:new]
    resources :payment_intents, only: [:create]
end
```

## Create a view for new checkout

This is where users will make payments. Create a file at `app/views/payments/checkouts/new.html.erb` and use the boilerplate form provided through the [Stripe docs](https://stripe.com/docs/payments/accept-a-payment). Stripe assumes you have hard-coded prices for your one-time payments. This engine allows users to provide a custom amount, so we add the `amount` input, which we'll use to create the PaymentIntent. It also has a custom [pattern](https://developer.mozilla.org/en-US/docs/Web/HTML/Attributes/pattern) to format the input and require only numbers (with up to two decimal places).  

```html
<!-- app/views/payments/checkouts/new.html.erb -->
<form id="payment-form">
  <div>
    <label for="amount">Amount (USD)</label>
    <input
        id="amount"
        type="tel"
        placeholder="100.00"
        required=""
        autocomplete="tel"
        pattern="(?=.*?\d)^\$?(([1-9]\d{0,2}(\d{3})*)|\d+)?(\.\d{1,2})?$"
    />
    </div>
    <div id="card-element">
      <!-- Elements will create input elements here -->
    </div>
    <!-- We'll put the error messages in this element -->
    <div id="card-errors" role="alert"></div>
    <button id="submit">Pay</button>
</form>
```

## Add Stripe Elements to the application layout 

In order for Stripe to work on the client side, we need to include [Stripe Elements](https://stripe.com/docs/stripe-js) in the view. We can set that up in `app/views/layouts/payments/application.html.erb`

```html
<!-- app/views/layouts/payments.application.html.erb -->
<!DOCTYPE html>
<html>
  <head>
    <title>Payments</title>
    <%= csrf_meta_tags %>
    <%= csp_meta_tag %>
    <%= stylesheet_link_tag "payments/application", media: "all" %>
    <script src="https://js.stripe.com/v3/"></script>
    <meta name="stripePublishableKey" content="<%= Rails.configuration.x.stripe.publishableKey %>" />
  </head>
  <body>
    <%= yield %>
  </body>
</html>
```

We also add a `meta` tag to embed the Stripe publishable key. We'll use that in our client-side JavaScript.

## The client-side JavaScript

We'll add a `script` tag at the bottom of `app/views/payments/checkouts/new.html.erb`. The script will provide a basic user story for the checkout: 

1. Get the publishable key from the `meta` tag 
2. Get the [CSRF token](https://guides.rubyonrails.org/security.html#csrf-countermeasures)
3. Initialize Stripe Elements
4. Mount Stripe Elements to the `card` element
5. Set up error checking on the `card-element` to provide feedback if users don't provide well formatted card information
6. Set up an event listener for the form `submit` event 
7. Tell the `submit` handler to POST to the `/payments/payment_intents`
8. Receive the `PaymentIntent` from the `PaymentIntentsController` 
9. Submit the `PaymentIntent` to Stripe 
10. Alert the user based on errors or successes

After the closing `form` tag, add:

```html
<script>
  var publishableKey = document.getElementsByName('stripePublishableKey')[0].content
  var csrftoken = document.getElementsByName("csrf-token")[0].content;
  var stripe = Stripe(publishableKey);
  var elements = stripe.elements();
  var style = {
      base: {
          color: "#32325d",
      }
  };

  var card = elements.create("card", { style: style });
  card.mount("#card-element");

  document.getElementById('card-element').addEventListener('change', function (event) {
      var displayError = document.getElementById('card-errors');
      if (event.error) {
          displayError.textContent = event.error.message;
      } else {
          displayError.textContent = '';
      }
  });

  var form = document.getElementById('payment-form');

  form.addEventListener('submit', function (ev) {
      ev.preventDefault();
      // Get the data from the form
      var data = {
          amount: document.getElementById('amount').value * 100
      }
      // Get the client secret
      fetch('/payments/payment_intents', {
          method: 'POST',
          headers: {
              "Content-Type": "application/json",
              "X-CSRF-Token": csrftoken,
          },
          body: JSON.stringify(data),
      }).then(function (response) {
          response.json().then(function (data) {
              confirmPayment(data.client_secret);
          })
      })
      // Confirm the payment
      function confirmPayment(clientSecret) {
          stripe.confirmCardPayment(clientSecret, {
              payment_method: {
                  card: card
              }
          }).then(function (result) {
              if (result.error) {
                  // Show error to your customer (e.g., insufficient funds)
                  window.alert(result.error.message);
              } else {
                  // The payment has been processed!
                  if (result.paymentIntent.status === 'succeeded') {
                      window.alert('Succeeded!')
                      // Show a success message to your customer
                      // There's a risk of the customer closing the window before callback
                      // execution. Set up a webhook or plugin to listen for the
                      // payment_intent.succeeded event that handles any business critical
                      // post-payment actions.
                  }
              }
          });
      }
  });
</script>
```

Notice when we set the `amount`, we multiply it by 100: 

```js
amount: document.getElementById('amount').value * 100
```

This is because Stripe handles amounts as integer values in cents. The input is formatted for dollars, so we multiply by 100 to get the correct amount of cents to pass to the `create` method in `PaymentIntentsController`. 

## Try it out in a host application 

Make a new Rails application. In the console: 

```sh
cd ..
rails new hostapp
cd hostapp
```

[Mount the engine](https://guides.rubyonrails.org/engines.html#mounting-the-engine). In `hostapp/Gemfile`: 

```
gem 'payments', path: 'full/path/to/payments'
```

Run `bundle` in the command line to install everything. 

## Set up the engine routes

In `hostapp/config/routes.rb`, add the routes: 

```rb
# hostapp/config/routes.rb
Rails.application.routes.draw do
  # For details on the DSL available within this file, see https://guides.rubyonrails.org/routing.html
  mount Payments::Engine, at: "/payments"
end
```

## Link the engine stylesheet

The stylesheet from the engine needs to be linked to the hostapp for asset compilation. In `hostapp/app/assets/stylesheets/application.css`, add `//= link payments/application.css`.

The file should look like this entirely: 

```css
/*
 * This is a manifest file that'll be compiled into application.css, which will include all the files
 * listed below.
 *
 * Any CSS and SCSS file within this directory, lib/assets/stylesheets, or any plugin's
 * vendor/assets/stylesheets directory can be referenced here using a relative path.
 *
 * You're free to add application-wide styles to this file and they'll appear at the bottom of the
 * compiled file so the styles you add here take precedence over styles defined in any other CSS/SCSS
 * files in this directory. Styles in this file should be added after the last require_* statement.
 * It is generally better to create a new file per style scope.
 *
 *= require_tree .
 *= require_self
 //= link payments/application.css
 */
 ```

## Securely store your Stripe API keys

Use [Rails credentials](https://medium.com/cedarcode/rails-5-2-credentials-9b3324851336) to store your Stripe keys. For now, we can just the the test publishable key and the test secret key. 

In the command line: 

```sh
EDITOR="vim" rails credentials:edit
```

Then edit the file to add the following YAML: 

```yml
stripe:
    test_publishable_key: your_key_here
    test_secret_key: your_key_here
```

## Add the test keys to the development environment

In `hostapp/config/environments/development.rb`:

```rb
# `hostapp/config/environments/development.rb`
# . . . other configuration here
  config.x.stripe.publishableKey = Rails.application.credentials.stripe[:test_publishable_key] 
  config.x.stripe.secret = Rails.application.credentials.stripe[:test_secret_key]
```

## Test it out

From within the `hostapp` directory: 

1. Run `rails s`
2. Visit localhost:3000/payments/checkouts/new 
3. Input an amount, fill in a [test card number](https://stripe.com/docs/testing#cards), 
4. Submit the form and check your Stripe dashboard for the test charges.

## Next steps

This engine isn't quite ready for primetime. This is mostly a proof-of-concept that I plan to expand on for personal use. Here are some things I might do to make it a little more versatile: 

* Create an installation rake task to handle the routing and asset linking with a command like `rails generate payments:install`
* Create some generators to render the views and controllers for further configuration, like [Devise does](https://github.com/heartcombo/devise#configuring-views). 
* Handle the client-side JavaScript more gracefully. I don't love writing it inline, but I had trouble including the JavaScript correctly through the generator. I need to learn how to do that, or consider packaging it up separately to drop in as a separate JS dependency. 