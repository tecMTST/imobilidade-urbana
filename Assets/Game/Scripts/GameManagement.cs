using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.UI;

public class GameManagement : MonoBehaviour{

    public Transform[] interactableObjects;

    public static GameManagement Instance;

    public Animation panelFadeImage;

    private PlayerController playerController;
    private Vector3 playerInitialPosition;

  
        


    // Start is called before the first frame update
    void Start(){

            DontDestroyOnLoad(this.gameObject);

            Instance = this;
            Application.targetFrameRate = 60;
        


        playerController = PlayerController.Instance;
        playerInitialPosition = playerController.transform.position;
        
    }

    // Update is called once per frame
    void Update(){
        
    }


    /// <summary>
    /// Sets the player position in the wolrd scene
    /// </summary>
    /// <param name="position" >
    ///     <para>
    ///         The desired position. Initial position by default
    ///     </para>
    ///     <para>
    ///         The Y axis is always the same of initial position
    ///     </para>
    ///</param>
    public void SetPlayerPosition(Vector3 position = new Vector3()) {

        playerController.transform.position = position == new Vector3(0, 0, 0) ? 
                                              playerInitialPosition : new Vector3(position.x, playerInitialPosition.y, position.z);

        panelFadeImage.enabled = false;


       
    }

    public void GambiarraDesgracadaDosNPCMaltitoCaralhoInferno() {


        //foreach (Transform t in interactableObjects) {

        //    Vector3 originalPosition = t.position;

        //    t.position = new Vector3().normalized;

        //    t.localPosition = originalPosition;

        //}


    }

    //public void StopCoroutines(string name = null) {

    //    if (name != null)
    //        StopAllCoroutines();
    //    else
    //        StopCoroutine(name);

    //}
}
