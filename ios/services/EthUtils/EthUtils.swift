//
//  EthUtils.swift
//  haqq
//
//  Created by Andrey Makarov on 01.11.2022.
//

import Foundation

enum RNEthUtilsError: Error {
  case hdkey;
  case hdkey_derive;
  case mnemonic_invalid;
  case private_key_not_found;
  case mnemonic_not_found;
  case encode_json;
}


struct RNEthUtilsResult: Codable {
  var privateKey: String;
  var address: String;
  var mnemonic: Optional<String>;
  
  public func toJSON() throws -> String {
    let jsonEncoder = JSONEncoder();
    
    guard let encode = try? jsonEncoder.encode(self) else {
      throw RNEthUtilsError.encode_json;
    }
    
    guard let resp = String(data: encode, encoding: .utf8) else {
      throw RNEthUtilsError.encode_json;
    }
    
    return resp
  }
}


@objc(RNEthUtils)
class RNEthUtils: NSObject {
  @objc
  static func requiresMainQueueSetup() -> Bool { return true }
  
  @objc
  public func generateMnemonic(_ strength: Optional<NSNumber>, resolve: RCTPromiseResolveBlock, rejecter reject: RCTPromiseRejectBlock) -> Void {
    do {
      let strength =  Int(truncating: strength ?? 16)
      
      let mnemonic = Mnemonic(bytes: Mnemonic.generateEntropy(strength: strength))
      
      if !mnemonic.isValid {
        throw RNEthUtilsError.mnemonic_invalid
      }
      
      resolve(mnemonic.mnemonic.joined(separator: " "))
    } catch {
      logger("generateMnemonic \(error)")
      reject("0", "generateMnemonic \(error)", nil)
    }
  }
  
  @objc
  public func restoreFromPrivateKey(_ privateKey: Optional<String>, resolve: RCTPromiseResolveBlock, rejecter reject: RCTPromiseRejectBlock)-> Void {
    do {
      guard let privateKey = privateKey else {
        throw RNEthUtilsError.private_key_not_found;
      }

      let wallet = Wallet(privateKey: privateKey)
        
      let resp = RNEthUtilsResult(
        privateKey: "0x\(Data(wallet.privateKey).toHexString())",
        address: "0x\(Data(wallet.address).toHexString())",
        mnemonic: nil
      )
      
      let json = try! resp.toJSON()
      resolve(json)
    } catch {
      logger("restoreFromPrivateKey \(error)")
      reject("0", "restoreFromPrivateKey \(error)", nil)
    }
  }
  
  @objc
  public func restoreFromMnemonic(_ mnemonicPhrase: Optional<String>, path: Optional<String>, resolve: RCTPromiseResolveBlock, rejecter reject: RCTPromiseRejectBlock)-> Void {
    do {
      guard let mnemonicPhrase = mnemonicPhrase else {
        throw RNEthUtilsError.private_key_not_found;
      }

      let path: String = path == nil ? "m/44'/60'/0'/0/0": path!

      let mnemonic = Mnemonic(phrase: mnemonicPhrase, pass: "")

      if !mnemonic.isValid {
        throw RNEthUtilsError.mnemonic_invalid
      }

      guard let hdkey = try? HDKey(seed: mnemonic.seed) else {
       throw RNEthUtilsError.hdkey
      }

      guard let child = hdkey.derive(path: path) else {
        throw RNEthUtilsError.hdkey_derive
      }

      let wallet = Wallet(hdkey: child)

      let resp = RNEthUtilsResult(
        privateKey: "0x\(Data(wallet.privateKey).toHexString())",
        address: "0x\(Data(wallet.address).toHexString())",
        mnemonic: mnemonic.mnemonic.joined(separator: " ")
      )

      let json = try! resp.toJSON()

      resolve(json)
    } catch {
      logger("restoreFromMnemonic \(error)")
      reject("0", "restoreFromMnemonic \(error)", nil)
    }
  }
}
