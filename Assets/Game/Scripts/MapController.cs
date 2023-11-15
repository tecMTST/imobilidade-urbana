using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.UI;
using UnityEngine.SceneManagement;
using UnityEngine.Tilemaps;
using Unity.VisualScripting;

public class MapController : MonoBehaviour
{

    public List<RectTransform> mapWagons;
    public GameObject playerMapIcon;
    public GameObject map;

    public bool[] reveledWagons;



    // Start is called before the first frame update
    void Awake(){

        DontDestroyOnLoad(this.gameObject);

        GetDependencies();
        reveledWagons = new bool[15];

        for (int i = 0; i < 15; i++) {
            reveledWagons[i] = false;
        }




        HideMap();
        SetPlayerMapPosition(7);
        

        //SetPlayerMapPosition(7);
        RevealMap();
        SceneManager.sceneLoaded += OnSceneLoaded;
        SceneManager.sceneUnloaded += OnSceneUnload;

       
       

       

    }

 
    // Update is called once per frame
    void Update(){
        
    }

    private void GetDependencies() {

        map = GameObject.FindGameObjectWithTag("map");
        map.GetComponentsInChildren<RectTransform>(mapWagons);

        mapWagons = mapWagons.FindAll(item => item.tag == "Untagged");
        mapWagons.Reverse();


        playerMapIcon = GameObject.FindGameObjectWithTag("playerMapIcon");

    }

    void OnSceneLoaded(Scene scene, LoadSceneMode mode) {


        GetDependencies();
        RevealMap();

        if (scene.name == "GameOverScene") {
            Destroy(this.gameObject);
            return;
        }
            


    }

    void OnSceneUnload(Scene scene) {

        //print("------Unloaded---------");

        for (int i = 0; i < reveledWagons.Length; i++) {
            if (reveledWagons[i]) {

            }
                //print(reveledWagons[i] + " in " + i);


        }

        //GetDependencies();


        

    }

    public void RevealMap(){

        print("RevealMap");

        for (int i = 0; i < reveledWagons.Length; i++) {
            if (!reveledWagons[i]) {
                continue;
            }

            mapWagons[i].GetComponent<Image>().color = Color.white;
            print(mapWagons[i]);
            print("RevealMapIf");



        }
    }

    /// <summary>
    /// 
    /// </summary>
    /// <param name="index">The initial wagon (not hidden)</param>
    public void HideMap() {

        for(int i=0; i < reveledWagons.Length; i++) {
            if (reveledWagons[i])
                continue;

           

            mapWagons[i].GetComponent<Image>().color = Color.clear;

            print("continuou " + i);
        }
    }

    public void SetPlayerMapPosition(int index){
        reveledWagons[index] = true;
        playerMapIcon.transform.SetParent(mapWagons[index].transform, false);
    }
}
