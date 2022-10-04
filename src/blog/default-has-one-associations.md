---
layout: post
title: 'Default has_one associations in Rails'
tags: ['rails', 'associations', 'has_one', 'defaults', 'database', 'post']
description: 'This week I spent some time working with Rails has_one associations and setting default values for them.'
date: 2019-06-14
---

This week my team was working on a component that needs a default image. 

We're using `has_one` to set up a relationship between the component and `imageable`. 

Our component looked like this at first: 

```
class Component < ApplicationRecord
    belongs_to :page

    has_one :background_image, -> { where image_category: 'background_image' }, class_name: 'Image', as: :imageable, dependent: :destroy
end
```

When our users create a new `Component`, they get a preview of it, and we want our preview to have a default image associated with it. In order to set up a default `has_one` association, we modified our model to look like: 

```
class Component < ApplicationRecord
    after_create :create_stand_in_image
    belongs_to :page

    has_one :background_image, -> { where image_category: 'background_image' }, class_name: 'Image', as: :imageable, dependent: :destroy

    def create_stand_in_image
        create_background_image!(slug: "circle_component_#{id}_background_image", image_value: Rails.root.join('app/assets/images/default_component_image.jpg').open )
    end
end
```

This modification uses an `after_create` [Active Record callback](https://guides.rubyonrails.org/active_record_callbacks.html) to run the `create_background_image!` method every time a new `Component` is created. So when a user makes a new one, they'll have our `default_component_image.jpg` file on hand.