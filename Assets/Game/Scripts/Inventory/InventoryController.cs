using System.Collections;
using System.Collections.Generic;
using System.Runtime.CompilerServices;
using UnityEngine;

public class InventoryController : MonoBehaviour{

    public static List<InventoryItem> inventory = new();
    public List<GameObject> ui_Items;

    public Transform inventoryParent;
    public GameObject itemPrefab;

    // Start is called before the first frame update
    void Start(){

        SetNewItem();
        SetNewItem();
        RefreshInventoryUI();
    }

    // Update is called once per frame
    void Update(){
        
    }

    public static void SetNewItem(){
        InventoryItem inventoryItem = new();
        inventory.Add(inventoryItem);
    }

    public static void RemoveItem(string itemName) {
        inventory.RemoveAll(item => item.itemName == itemName);
    }

    public static bool VerifyItemByName(string itemName) {
        return inventory.Exists(item => item.itemName == itemName);
    }

    public void RefreshInventoryUI() {

        foreach(GameObject uiItem in ui_Items) {
            DestroyImmediate(uiItem);
        }

        foreach(InventoryItem item in inventory) {
            GameObject gO = Instantiate(itemPrefab, inventoryParent);
            InventoryItem inventItem = gO.GetComponent<InventoryItem>();

            inventItem.sprite = item.sprite;
            inventItem.image = item.image;
            inventItem.itemName = item.itemName;

            ui_Items.Add(gO);
        }

    }


   
}


