// modules/device-info/ios/DeviceInfoModule.swift
import ExpoModulesCore
import Darwin

public class DeviceInfoModule: Module {
  public func definition() -> ModuleDefinition {
    Name("DeviceInfo")

    // Синхронный метод – выполняется мгновенно через JSI
    SyncFunction("getMemoryInfoSync") {
      return getMemoryInfo()
    }

    // Асинхронный метод – для потенциально долгих операций
    AsyncFunction("getMemoryInfoAsync") {
      return getMemoryInfo()
    }
  }

  private func getMemoryInfo() -> [String: Any] {
    var info = mach_task_basic_info()
    var count = mach_msg_type_number_t(MemoryLayout<mach_task_basic_info>.size) / 4
    let kerr: kern_return_t = withUnsafeMutablePointer(to: &info) {
      $0.withMemoryRebound(to: integer_t.self, capacity: 1) {
        task_info(mach_task_self_, task_flavor_t(MACH_TASK_BASIC_INFO), $0, &count)
      }
    }
    let totalMemory = ProcessInfo.processInfo.physicalMemory
    let usedMemory = (kerr == KERN_SUCCESS) ? info.resident_size : 0
    let freeMemory = totalMemory - usedMemory
    return [
      "totalMemory": totalMemory,
      "freeMemory": freeMemory,
      "usedMemory": usedMemory
    ]
  }
}