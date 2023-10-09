using System.Collections;
using System.Collections.Generic;
using System.Runtime.CompilerServices;
using UnityEngine;

public class InventoryController : MonoBehaviour{

    public int items;

    public List<InventoryItem> inventory = new();
    public List<GameObject> ui_Items;

    public Transform inventoryParent;
    public GameObject itemPrefab;

    public static InventoryController Instance;

    // Start is called before the first frame update
    void Start(){

        Instance = this;

        for (int i = 0; i < items; i++) {
            SetNewItem();
        }

        RefreshInventoryUI();


    }

    // Update is called once per frame
    void Update(){
        
    }

  

    public void SetNewItem(){
        InventoryItem inventoryItem = new();
        inventory.Add(inventoryItem);
        RefreshInventoryUI();
    }

    public void RemoveItem(string itemName) {
        inventory.RemoveAll(item => item.itemName == itemName);
        RefreshInventoryUI();

    }

    public void RemoveLastItem() {
        inventory.RemoveAt(inventory.Count - 1);
        RefreshInventoryUI();

    }

    public bool VerifyItemByName(string itemName) {
        return inventory.Exists(item => item.itemName == itemName);
    }

    public void RefreshInventoryUI() {

        foreach(GameObject uiItem in ui_Items) {
            
            Destroy(uiItem);
            
        }

        ui_Items.Clear();

        print(inventory.Count);
        print(ui_Items.Count);




        foreach (InventoryItem item in inventory) {
            GameObject gO = Instantiate(itemPrefab, inventoryParent);
            InventoryItem inventItem = gO.GetComponent<InventoryItem>();

            inventItem.sprite = item.sprite;
            inventItem.image = item.image;
            inventItem.itemName = item.itemName;

            ui_Items.Add(gO);
        }

    }


   
}


