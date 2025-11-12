<?php

namespace {
    /**
     * @param Closure(\Tests\TestCase):void $closure
     */
    function test(string $description, Closure $closure): void {}

    /**
     * @param Closure(\Tests\TestCase):void $closure
     */
    function it(string $description, Closure $closure): void {}
}
