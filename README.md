# css-hallway
Project is abstraction of "hallway" using 3d css.

Hallway is list or "rows" in hall. Each row can contain walls or another hallways.

Example html of simple hallway:
```
<ul class="hallway">
    <li class="root">
        <div class="left" data-position="">left</div>
        <div class="top" data-position="">top</div>
        <div class="bottom" data-position="">bottom</div>
        <div class="right">
            <ul class="hallway">
                <li>
                    <div class="bottom" data-position="">bottom</div>
                    <div class="top" data-position="">top</div>
                    <div class="left" data-position="f-12-1">
                        right 1 - left 2
                    </div>
                    <div class="right" data-position="b-12-1">
                        right 1 - right 2
                    </div>
                </li>
                <li>
                    <div class="behind" data-position="">behind</div>
                    <div class="bottom" data-position="">bottom</div>
                    <div class="top" data-position="">top</div>
                    <div class="left" data-position="f-11-1">
                        right 1 - left 1
                    </div>
                    <div class="right"  data-position="b-11-1">
                        right 1 - right 1
                    </div>
                </li>

            </ul>
        </div>
    </li>
</ul>
```

See [Live example](http://xx.wz.sk/C/)