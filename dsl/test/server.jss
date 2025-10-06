script [
    this.title = "Hello";
]

div
    onclick={this.bind.ez}
    class="flex"
[
    div [
        {this.hi}
    ]
]