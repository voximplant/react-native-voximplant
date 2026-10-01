//
//  Copyright (c) 2011-2026, Zingaya, Inc. All rights reserved.
//

import Foundation

struct Atomic<Value> {
    private var value: Value
    private let queue = DispatchQueue(label: "accessQueue", attributes: .concurrent)

    init(_ value: Value) {
        self.value = value
    }

    func access<T>(_ keyPath: KeyPath<Value, T>) -> T {
        queue.sync { value[keyPath: keyPath] }
    }

    func access<T>(_ accessing: (Value) -> T) -> T {
        queue.sync { accessing(value) }
    }

    mutating func mutate(_ newValue: Value) {
        queue.sync(flags: .barrier) { value = newValue }
    }

    mutating func mutate(_ mutation: (inout Value) -> Void) {
        queue.sync(flags: .barrier) { mutation(&value) }
    }
}
