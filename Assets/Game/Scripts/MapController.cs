using System.Collections.Generic;
using UnityEngine;
using UnityEngine.UI;
using UnityEngine.SceneManagement;


public class MapController : MonoBehaviour
{

    public List<RectTransform> mapWagons;
    public GameObject playerMapIcon;
    public GameObject map;

    public bool[] reveledWagons;



    // Start is called before the first frame update
    void Awake(){

        

        //GetDependencies();
        reveledWagons = new bool[15];

        for (int i = 0; i < 15; i++) {
            reveledWagons[i] = false;
        }


        HideMap();
        SetPlayerMapPosition(7);

        RevealMap();
        //SceneManager.sceneLoaded += OnSceneLoaded;
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

        if (scene.name == "GameOverScene") {
            Destroy(this.gameObject);
            return;
        }

        GetDependencies();
        RevealMap();

    }

    void OnSceneUnload(Scene scene) {


        for (int i = 0; i < reveledWagons.Length; i++) {
            if (reveledWagons[i]) {

            }


        }

        //GetDependencies();


        

    }

    public void RevealMap(){


        for (int i = 0; i < reveledWagons.Length; i++) {
            if (!reveledWagons[i]) {
                continue;
            }

            mapWagons[i].GetComponent<Image>().color = Color.white;

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

        }
    }

    public void SetPlayerMapPosition(int index){
        reveledWagons[index] = true;
        playerMapIcon.transform.SetParent(mapWagons[index].transform, false);
    }
}
